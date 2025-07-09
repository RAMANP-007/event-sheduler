import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { House, Calendar, Cloud, Gear } from 'react-bootstrap-icons';
import { BoxArrowRight } from 'react-bootstrap-icons'; // Import logout icon

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session data
    localStorage.removeItem('authToken');
    // Redirect to the login page
    navigate('/login');
  };

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{ width: '280px', height: '100vh' }}>
      <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <span className="fs-4">Event Scheduler</span>
      </a>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink to="/dashboard" className="nav-link text-white" end>
            <House className="me-2" />
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/events" className="nav-link text-white">
            <Calendar className="me-2" />
            Events
          </NavLink>
        </li>
        <li>
          <NavLink to="/alerts" className="nav-link text-white">
            <Cloud className="me-2" />
            Weather Alerts
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" className="nav-link text-white">
            <Gear className="me-2" />
            Settings
          </NavLink>
        </li>
      </ul>
      <hr />
      {/* Logout Button */}
      <ul className="nav nav-pills flex-column">
        <li>
          <button onClick={handleLogout} className="nav-link text-white btn btn-link text-start">
            <BoxArrowRight className="me-2" />
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;