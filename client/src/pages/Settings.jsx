import React from 'react';
import LocationFetcher from '../components/LocationFetcher';
import NotificationManager from '../components/NotificationManager';

const Settings = () => {
  return (
    <div>
      <h3>Settings</h3>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Preferences</h5>
          <div className="form-check form-switch mb-3">
            <input className="form-check-input" type="checkbox" id="smartScheduling" defaultChecked />
            <label className="form-check-label" htmlFor="smartScheduling">Enable Smart Scheduling</label>
          </div>
          <div className="form-check form-switch mb-3">
            <input className="form-check-input" type="checkbox" id="notifications" defaultChecked />
            <label className="form-check-label" htmlFor="notifications">Enable Notifications</label>
          </div>
          <div>
            <label htmlFor="severity" className="form-label">Weather Severity Sensitivity</label>
            <select id="severity" className="form-select">
              <option>Light Rain</option>
              <option>Heavy Rain</option>
              <option>Storm</option>
              <option>High Temperature</option>
            </select>
          </div>
        </div>
      </div>
      <LocationFetcher />
      <NotificationManager />
    </div>
  );
};

export default Settings;
