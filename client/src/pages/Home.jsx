import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  }, [navigate]);

  return <Loader />;
};

export default Home;
