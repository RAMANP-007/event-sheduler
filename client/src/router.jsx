import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CalendarPage from './pages/CalendarPage';
import WeatherAlerts from './pages/WeatherAlerts';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      {
        path: '/',
        element: <App />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'home', element: <Home /> },
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'calendar', element: <CalendarPage /> },
          { path: 'weather-alerts', element: <WeatherAlerts /> },
          { path: 'settings', element: <Settings /> },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '*', // Catch-all route for 404 Not Found
    element: <NotFound />,
  },
]);

export default router;
