import React from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import TripTrack from './components/tripTrack/TripTrack';
import TripDetails from './pages/tripdetails/TripDetails';

function App() {
  return (
    <section className="container-fluid overflow-hidden p-0">
      <BrowserRouter>
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-1 p-0 col-2 d-none d-md-block">
            <div className="sidebar">
              <ul>
                <li>
                  <Link to="/"><i className="bi bi-car-front"></i></Link>
                </li>
                {/* <li>
                  <Link to="/"><i className="bi bi-person"></i></Link>
                </li>
                <li>
                  <Link to="/"><i className="bi bi-hourglass-bottom"></i></Link>
                </li>
                <li>
                  <Link to="/"><i className="bi bi-map"></i></Link>
                </li> */}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-md-4 p-0 col-12 d-none d-md-block">
            <div className="second p-0">
              <TripTrack />
            </div>
          </div>

          {/* Trip Details Section */}
          <div className="col-md-7 p-0 d-none d-md-block">
            <div className="main">
              <Routes>
                <Route path="/trip/details/:id" element={<TripDetails />} />
                <Route path="/*" element={<h1>Not Found</h1>} />
                <Route path='/' element={

               <div className='container-fluid'>
                   <div className='row'>
                    <div className="col-md-6 m-auto">
                    <div className="nodata p-3 text-center d-flex flex-column gap-3 align-items-center justify-content-center">
                  <img
                    src="https://www.realestatedirectory.in/image/no-data.gif"
                    alt="No Data"
                    className="w-100"
                  />
                    <>
                      <h1 className="fs-4 mb-0">No  Trip selected</h1>
                      <p className="fs-6 text-secondary mt-0">
                        click any trip view the trip details
                      </p>
                      </>
                    </div>
                    </div>
                  </div>
               </div>
                }/>
              </Routes>
            </div>
          </div>

          <div className="col-md-7 p-0 d-black d-md-none col-12">
            <div className="main">
              <Routes>
              <Route path="/" element={<TripTrack />} />
                <Route path="/trip/details/:id" element={<TripDetails />} />
                <Route path="/*" element={<h1>Not Found</h1>} />
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </section>
  );
}

export default App;
