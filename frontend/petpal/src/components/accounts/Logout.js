import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the token (assuming it's stored in localStorage)
    localStorage.removeItem('token');

    // Redirect the user to the home page
    navigate('/');
  };

  return (
    <Button variant="dark" className="mx-2 login" onClick={handleLogout} href="/login">Logout</Button>
  );
};

export default Logout;
