import React, { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import './style.css';
import All from './All';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

function TripTrack() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="container-fluid p-1 bg-light h-100 p-0">
      <div className="card p-3 border-l">
        <h1 className="fs-5 text-start">RSR Tours & Travels</h1>
      </div>
      <div className="search card mt-2 p-2 border-l">
        <div className="search-input d-flex align-items-center gap-2">
          <i className="bi bi-search"></i>
          <input
            type="text"
            className="form-control"
            placeholder="Search by Trip ID, Route..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="main-btn mt-3 rounded">Search</button>
        <br />
        <div className="text-start">
   <label htmlFor="date" className='text-success'>Select a date to Filter Trips</label>
        <input 
        type="date" 
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)} 
        className='form-control p-3 mt-2'
        />
   </div>
      </div>
        
  
      <Tabs defaultActiveKey="all" id="trip-tabs" className="mb-3 bg-white p-0 w-100" style={{marginLeft:'15px'}}>
        <Tab eventKey="all" title="All">
          <All status="all" searchQuery={searchQuery} selectedDate={selectedDate}/>
        </Tab>
        <Tab eventKey="in_progress" title="In Progress">
          <All status="in_progress" searchQuery={searchQuery} selectedDate={selectedDate}/>
        </Tab>
        <Tab eventKey="completed" title="Completed">
          <All status="completed" searchQuery={searchQuery} selectedDate={selectedDate}/>
        </Tab>
      </Tabs>
    </div>
  );
}

export default TripTrack;
