import React, { useState } from 'react';
import { createApplication } from '../../api.js';
import { Container, Navbar, Nav, Button, Card } from 'react-bootstrap';
import Logout from '../accounts/Logout';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const AdoptionApplication = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const { petId } = state || {};

  const [formData, setFormData] = useState({
    description: '', // Single field for the reason
    pet: petId, // Single field for the pet ID
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call the createApplication function with formData
      const response = await createApplication(formData);

      navigate('/view_applications');
      console.log('Application submitted successfully:', response);
      // You can add additional logic for handling successful submission
    } catch (error) {
      console.error('Error submitting application:', error);
      // You can add additional logic for handling errors
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar color-white">
        <Container>
          <Navbar.Brand href="/">PetPal</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarResponsive" />
          <Navbar.Collapse id="navbarResponsive">
            <Nav className="me-auto mb-2 mb-lg-0">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/search">Adopt a Pet</Nav.Link>
                  <Nav.Link href="/shelters">View Shelters</Nav.Link>
                  <Nav.Link href="/all-blogs">Blogs</Nav.Link>
            </Nav>
            <div className="d-flex">
              <Logout />
                  <Button variant="dark" className="mx-2" href="/notifications">
                    Notifications
                  </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="container mt-5 text-center">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="reason" className="form-label">
              Why do you want this pet?
            </label>
            <textarea
              className="form-control"
              id="description"
              rows="3"
              placeholder="Please tell us why you want to adopt this pet."
              value={formData.reason}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-dark btn-custom">
              Apply
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdoptionApplication;