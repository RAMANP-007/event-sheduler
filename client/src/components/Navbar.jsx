import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Navbar = ({ theme, toggleTheme }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const isLoggedIn = !!localStorage.getItem('authToken');

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom app-navbar">
      <div className="container-fluid">
        <NavLink className="navbar-brand fw-semibold" to="/dashboard">
          <i className="bi bi-calendar-check me-2"></i>
          Eventide
        </NavLink>



                  <div className="theme-switcher ms-3" onClick={toggleTheme}>
            {theme === 'light' ? <i className="bi bi-moon-stars-fill"></i> : <i className="bi bi-sun-fill"></i>}
          </div>
          <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/dashboard">
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/calendar">
                Calendar
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/weather-alerts">
                Weather Alerts
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/settings">
                Settings
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            <div className="me-3">
                <i className="bi bi-bell fs-5 text-muted-light"></i>
            </div>
            {isLoggedIn ? (
              <button className="btn btn-outline-primary" onClick={handleLogout}>Logout</button>
            ) : (
              <button className="btn btn-primary" onClick={handleLogin}>Login</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
