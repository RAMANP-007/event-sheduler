import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import EmailLoginForm from '../components/EmailLoginForm';
import GoogleLoginButton from '../components/GoogleLoginButton';

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const authError = searchParams.get('error');

    if (token) {
      localStorage.setItem('authToken', token);
      navigate('/dashboard');
    } else if (authError) {
      setError('Google authentication failed. Please try again.');
    }
  }, [searchParams, navigate]);

  return (
    <AuthLayout title="Log In">
      {error && <div className="alert alert-danger">{error}</div>}
      <EmailLoginForm />
      <div className="my-3 text-center">OR</div>
      <GoogleLoginButton />
      <div className="text-center mt-3">
        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </div>
    </AuthLayout>
  );
};

export default Login;
