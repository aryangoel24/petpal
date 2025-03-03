import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Navbar, Nav } from 'react-bootstrap';
import { createPetListing, currentUser } from '../../api'; // Adjust the path accordingly
import Logout from '../accounts/Logout';
import { useNavigate } from 'react-router-dom';

const CreatePetListing = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    gender: '',
    size: '',
    description: '',
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isShelter, setIsShelter] = useState(false);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const userData = await currentUser();
        setIsLoggedIn(!!userData.user);
        setIsShelter(userData.user?.is_shelter || false);
      } catch (error) {
        console.error('Error checking current user:', error);
        setIsLoggedIn(false);
        navigate('/login');
      }
    };

    checkLoggedIn();
  }, []);

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
      // Call the createPetListing function from api.js
      const response = await createPetListing(formData);

      // Handle the response, e.g., show a success message or redirect the user
      console.log('Pet listing created successfully:', response);

      // Redirect the user to a pet details page or other appropriate page
      navigate('/');
    } catch (error) {
      console.error('Error creating pet listing:', error);
      // Handle the error, e.g., show an error message to the user
    }
  };

  if (!isLoggedIn || !isShelter) {
    // Redirect the user to the login page if not logged in or not a shelter
    navigate('/login');
    return null; // You can also render a message or loading indicator here
  }
  return (
    <>   
    
    <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar color-white">
        <Container>
          <Navbar.Brand href="/">PetPal</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarResponsive" />
          <Navbar.Collapse id="navbarResponsive">
          <Nav className="me-auto mb-2 mb-lg-0">
              <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/create-pet">Create a Pet</Nav.Link>
                <Nav.Link href="/create-blog">Write a Blog</Nav.Link>
            </Nav>
            <div className="d-flex">
                <>
                  <Button variant="dark" className="mx-2" href="/profile/update">
                    My Account
                  </Button>
                  <Button variant="dark" className="mx-2" href="/view_applications">
                    My Applications
                  </Button>
                  <div className="d-flex">
                  <Button variant="dark" className="mx-2" href="/notifications">
                    Notifications
                  </Button>
                            <Logout />
                        </div>
                </>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    <Container>
      <h1 className="text-center mt-4">Create Pet Listing</h1>
      <Form onSubmit={handleSubmit} className="mt-5" encType="multipart/form-data">
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Pet Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter pet's name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                name="age"
                placeholder="Enter pet's age"
                value={formData.age}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                as="select"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Form.Control>
            </Form.Group>
            {/* Add other basic information fields as needed */}
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Breed</Form.Label>
              <Form.Control
                type="text"
                name="breed"
                placeholder="Enter pet's breed"
                value={formData.breed}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Size</Form.Label>
              <Form.Control
                as="select"
                name="size"
                value={formData.size}
                onChange={handleChange}
              >
                <option value="">Select Size</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </Form.Control>
            </Form.Group>
            {/* Add other additional information fields as needed */}
          </Col>
        </Row>
        <div className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            placeholder="Enter pet's description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        {/* Add other form fields */}
        <div className="d-flex justify-content-center">
          <Button type="submit" variant="dark" className="btn-custom">
            Create
          </Button>
        </div>
      </Form>
    </Container>
    </>
  );
};

export default CreatePetListing;
