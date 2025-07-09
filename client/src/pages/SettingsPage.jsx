import React, { useState } from 'react';
import { motion } from 'framer-motion';
import 'bootstrap-icons/font/bootstrap-icons.css';
import AnimatedToggle from '../components/AnimatedToggle';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring' } },
};

const SettingsRow = ({ icon, title, description, children }) => (
  <div className="d-flex justify-content-between align-items-center w-100 py-3">
    <div className="d-flex align-items-center">
      <i className={`bi ${icon} fs-4 me-4`}></i>
      <div>
        <p className="mb-0 fw-medium">{title}</p>
        <small className="text-muted">{description}</small>
      </div>
    </div>
    <div>{children}</div>
  </div>
);

const SettingsPage = () => {
  const [eventReminders, setEventReminders] = useState(true);
  const [weatherUpdates, setWeatherUpdates] = useState(true);
  const [scheduleChanges, setScheduleChanges] = useState(false);

  return (
    <motion.div
      className="container-fluid"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="fw-bold mb-4">Settings</h2>

      <motion.div variants={itemVariants}>
        <h5 className="fw-semibold mb-3 mt-5">Calendar Integration</h5>
        <div className="card-futuristic p-4 mb-4">
          <SettingsRow
            icon="bi-calendar-plus"
            title="Connect Calendar"
            description="Sync events and weather forecasts."
          >
            <button className="btn btn-outline-primary">Connect</button>
          </SettingsRow>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h5 className="fw-semibold mb-3 mt-5">Notifications</h5>
        <div className="card-futuristic p-4 mb-4">
          <SettingsRow
            icon="bi-bell"
            title="Event Reminders"
            description="Receive reminders for upcoming events."
          >
            <AnimatedToggle isOn={eventReminders} handleToggle={() => setEventReminders(!eventReminders)} />
          </SettingsRow>
          <SettingsRow
            icon="bi-cloud-sun"
            title="Weather Updates"
            description="Get notified about weather changes."
          >
            <AnimatedToggle isOn={weatherUpdates} handleToggle={() => setWeatherUpdates(!weatherUpdates)} />
          </SettingsRow>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h5 className="fw-semibold mb-3 mt-5">Appearance & Weather</h5>
        <div className="card-futuristic p-4 mb-4">
          <SettingsRow
            icon="bi-palette"
            title="Theme"
            description="Theme is controlled globally for now."
          >
            <span className="text-muted">Dark</span>
          </SettingsRow>
          <SettingsRow
            icon="bi-geo-alt"
            title="Default Location"
            description="Set your default location."
          >
            <span className="text-muted">New York, NY</span>
          </SettingsRow>
          <SettingsRow
            icon="bi-thermometer-half"
            title="Units"
            description="Choose between Fahrenheit and Celsius."
          >
            <span className="text-muted">Fahrenheit</span>
          </SettingsRow>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsPage;