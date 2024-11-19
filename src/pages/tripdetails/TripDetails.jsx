import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaUserAlt, FaPhoneAlt, FaMapMarkerAlt, FaCalendarAlt, FaCar } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import Skeleton from "@mui/material/Skeleton"; // Import MUI Skeleton for loading state


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
  
function TripDetails() {
  const { id } = useParams();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://rsr-gps-backend.onrender.com/api/admin/trip/${id}`
        );
        setTripData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trip data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <section style={{ padding: "20px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <Skeleton variant="rectangular" width="100%" height={80} style={{ marginTop: "20px" }} />
        <Skeleton variant="text" width="80%" height={30} style={{ marginTop: "20px" }} />
        <Skeleton variant="text" width="60%" height={30} style={{ marginTop: "10px" }} />
      </section>
    );
  }

  if (!tripData) {
    return (
      <section style={{ padding: "20px", textAlign: "center" }}>
        <h6 className="text-danger">Failed to load trip details.</h6>
      </section>
    );
  }

  const { tripData: trip, driverData: driver, routesData: route } = tripData;

  return (
    <section style={{ padding: "20px" }} className="bg-light">
      <div className="" >
       <div className="">
        <div className="card border-0 shadow-sm p-3">
        <h4 className="mb-4 text-success fs-4">Trip Details</h4>
        <hr />

<h6 className="font-weight-bold">
<FaCar /> Trip Status:{" "}
<button className={ trip.status === "in_progress" ? "p-1 px-2 btn-in_progress text-success" : "p-1 px-2 text-warning completed" }>
{trip.status}
</button>
</h6>
<hr style={{ margin: "10px 0" }} />

<p className="fs-6">
<FaCalendarAlt /> <strong>Start Time: </strong>{new Date(trip.startTime).toLocaleString()}
</p>

<p className="mt-2">
<FaMapMarkerAlt /> <strong>Live Location: </strong>{" "}
<a href={trip.liveLocationLink} target="_blank" rel="noopener noreferrer">
View on Map
</a>
</p>

<p className="mt-2">
<MdLocationOn /> <strong>Start Location: </strong><Address
                      lat={trip.startLocation.latitude}
                      lon={trip.startLocation.longitude}
                    />

</p>

<p className="mt-2">
<MdLocationOn /> 
<strong>End Location: </strong>
{
    trip.endLocation?(<Address
        lat={trip.startLocation.latitude}
        lon={trip.startLocation.longitude}
      />):(
        <span className="text-danger">No End Location available.</span>
      )
}

</p>

    {
        trip.status == 'in_progress'?(
         <div className="row">
            <div className="col-md-4">
            <a href="" className="btn btn-success p-2 mt-3 px-4 rounded-pill">Track Live Location</a>
            </div>
         </div>
        ):(null)
    }

        </div>

        <div className="card border-0 shadow-sm p-3 mt-3">
             {/* Driver Details */}
          <h5 className="mt-4 font-weight-bold fs-4 text-success">Driver Information</h5>
          <hr />

        <h6>
        <FaUserAlt /> Driver Name: {driver.name}
        </h6>
        <h6>
        <FaPhoneAlt /> Driver Phone: {driver.phoneNumber}
        </h6>
        <h6>
        <FaMapMarkerAlt /> Cab Number: {driver.cabNo}
        </h6>

       <div className="row">
        <div className="col-md-4">
        <a href={`tel:${driver.phoneNumber}`} className="btn btn-warning p-2 px-4 rounded-pill mt-4">Call to Driver</a>
        </div>
       </div>

        </div>

        <div className="card p-3 border-0 shadow-sm
        mt-3">

             {/* Employees Information */}
          <h5 className="mt-4 font-weight-bold fs-4 text-success">Employees Picked Up for this Trip</h5>
          <hr />
          <h6 className="fs-5">
            <FaUserAlt /> Total Employees: {route?.employees?.length || 0}
          </h6>
          {route?.employees?.map((employee, index) => (
            <div key={index} className="mt-3 bg-light p-3 card">
              <h6 className="fs-5">
                <FaUserAlt /> {employee.name}
              </h6>
              <p className="fs-6">
                <FaMapMarkerAlt /> Pickup Point: {employee.startPoint}
              </p>
              <p className="fs-6">
                <FaMapMarkerAlt /> Drop Point: {employee.endPoint}
              </p>

              <div className="row">
                <div className="col-md-4">
                <a href={`tel:${employee.phoneNumber}`} className="btn btn-warning p-2 px-4 rounded-pill mt-4">Call to Employee</a>
                </div>
            </div>
            </div>
          ))}
        </div>
      
<div>
  
       </div>

         

         
        </div>
      </div>
    </section>
  );
}

export default TripDetails;
