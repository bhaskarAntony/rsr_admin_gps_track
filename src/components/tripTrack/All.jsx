import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, Skeleton } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const getAddressFromLatLon = async (lat, lon) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    return response.data.display_name;
  } catch (error) {
    console.error('Error fetching address:', error);
    return 'Address not available';
  }
};

const Address = ({ lat, lon }) => {
  const [address, setAddress] = useState('Loading address...');

  useEffect(() => {
    const fetchAddress = async () => {
      const fetchedAddress = await getAddressFromLatLon(lat, lon);
      setAddress(fetchedAddress);
    };
    fetchAddress();
  }, [lat, lon]);

  return <span>{address}</span>;
};

function All({ status, searchQuery, selectedDate }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get('https://rsr-gps-backend.onrender.com/api/admin/trips');
        setTrips(response.data);
      } catch (error) {
        console.error('Error fetching trips:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const filteredTrips = trips.filter((trip) => {
    const matchesStatus = status === 'all' || trip.status === status;
    const matchesSearch =
      trip._id.includes(searchQuery) || (trip.route && trip.route.includes(searchQuery));

    // Filter by selected date
    const matchesDate =
      selectedDate === null ||
      dayjs(trip.startTime).isSame(dayjs(selectedDate), 'day');

    return matchesStatus && matchesSearch && matchesDate;
  });

  return (
    <section className="p-3 " style={{marginLeft:'20px'}}>
      

      <Grid container spacing={3}>
        {loading ? (
          [1, 2, 3].map((_, index) => (
            <Grid item xs={12} key={index}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="80%" height={30} />
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="90%" height={20} />
                  <Skeleton variant="text" width="50%" height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : filteredTrips.length === 0 ? (
          <div className="nodata p-3 text-center d-flex flex-column gap-3 align-items-center justify-content-center">
            <img
              src="https://www.realestatedirectory.in/image/no-data.gif"
              alt="No Data"
              className="w-100"
            />
            <>
              <h1 className="fs-4 mb-0">No  Trips</h1>
              <p className="fs-6 text-secondary mt-0">
                Check after some time.
              </p>
              </>
          </div>
        ) : (
          filteredTrips.map((trip) => (
            <div className="card mb-3 border shadow-sm text-start w-100" key={trip._id}>
              <div className="card-body">
                <div className="d-flex gap-2 align-items-center">
                  <div className="car">
                    <i className="bi bi-car-front fs-3"></i>
                  </div>
                  <div>
                    <h5 className="fs-6">{trip._id}</h5>
                    <button
                      className={`p-1 px-2 small ${
                        trip?.status === 'in_progress'
                          ? 'btn-in_progress text-success'
                          : 'completed text-warning'
                      }`}
                    >
                      {trip.status}
                    </button>
                  </div>
                </div>
                <hr />
                <p className="card-text">
                  <strong className="text-success">Start Time:</strong>{' '}
                  {new Date(trip.startTime).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
                <p className="card-text">
                  <strong className="text-success">End Time:</strong>{' '}
                  {trip.endTime ? (
                    new Date(trip.endTime).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })
                  ) : (
                    <span className="text-danger">No End Time, Trip is Still in Progress</span>
                  )}
                </p>
                <hr />
                <p className="card-text">
                  <strong className="text-success">Start Location:</strong>{' '}
                  {trip.startLocation ? (
                    <Address
                      lat={trip.startLocation.latitude}
                      lon={trip.startLocation.longitude}
                    />
                  ) : (
                    'Not available'
                  )}
                </p>
                <p className="card-text">
                  <strong className="text-success">End Location:</strong>{' '}
                  {trip.startLocation ? (
                    trip.endLocation ? (
                      <Address
                        lat={trip.endLocation.latitude}
                        lon={trip.endLocation.longitude}
                      />
                    ) : (
                      <span className="text-danger">
                        End Location Not Available. Trip still in progress.
                      </span>
                    )
                  ) : (
                    'Not available'
                  )}
                </p>
                <a
                  href={`/trip/details/${trip._id}`}
                 
                
                  className="btn btn-light mt-3 w-100 rounded-pill p-3 border text-success"
                >
                  View Trip Details
                </a>
                {trip.liveLocationLink && (
                  <a
                    href={trip.liveLocationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success mt-3 w-100 rounded-pill p-3"
                  >
                    Track Live Location
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </Grid>
    </section>
  );
}

export default All;
