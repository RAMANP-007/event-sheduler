import React from 'react';

const AuthLayout = ({ title, children }) => {
  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow-sm">
          <div className="card-body p-5">
            <h3 className="card-title text-center mb-4">{title}</h3>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
