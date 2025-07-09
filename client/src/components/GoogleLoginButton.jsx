import React from 'react';
import { BsGoogle } from 'react-icons/bs';

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <button
      className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center"
      onClick={handleGoogleLogin}
    >
      <BsGoogle className="me-2" /> Sign in with Google
    </button>
  );
};

export default GoogleLoginButton;
