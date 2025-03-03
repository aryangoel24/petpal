import React, { useState } from 'react';
import { Navbar, Nav, Form, Button, Container, Row, Col } from 'react-bootstrap';
import { registerSeeker } from '../../api'; // Adjust the path accordingly
import { useNavigate } from 'react-router-dom';

const RegisterSeeker = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    name: '',
    location: '',
    profile_picture: null, // This will be a File object, initialized as null
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? e.target.files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate the password and password2 fields before submitting
      if (formData.password !== formData.password2) {
        alert('Passwords do not match!');
        return;
      }

      // Call the registerSeeker function from api.js
      console.log(formData)
      const response = await registerSeeker(formData);

      // Handle the response, e.g., show a success message
      console.log('Pet Seeker registered successfully:', response);

      // Redirect to the login page after successful registration
      navigate('/login'); // Assuming you have a login route
    } catch (error) {
      console.error('Error registering pet seeker:', error);
      // Handle the error, e.g., show an error message to the user
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
          </Nav>
          <div className="d-flex">
            <Button variant="dark" className="mx-2 login" href="/login">Log in</Button>
            <Button variant="dark" className="mx-2 register" href="/register_seeker">Sign up as a Pet Seeker</Button>
            <Button variant="dark" className="mx-2 register" href="/register_shelter">Sign up as a Pet Shelter</Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={6}>
          <h2 className="mb-3">Create Account here as a Pet Seeker</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Enter Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Retype Password</Form.Label>
              <Form.Control
                type="password"
                name="password2"
                placeholder="Re-Enter Password"
                value={formData.password2}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                placeholder="Enter Your Location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control
                type="file"
                name="profile_picture"
                onChange={handleChange}
                accept="image/*"
              />
            </Form.Group>
            <Button type="submit" variant="outline-dark" className="mx-2 btn-custom">
              Create Account
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
    </>
  );
};

export default RegisterSeeker;
