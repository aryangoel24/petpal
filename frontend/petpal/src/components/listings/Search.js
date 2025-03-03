import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Navbar, Nav } from 'react-bootstrap';
import { searchPetListings, getApplications } from '../../api';
import PetListingCard from './PetListingItem';
import Logout from '../accounts/Logout';
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useState({
    status: 'available',
    breed: '',
    age: '',
    size: '',
    gender: '',
    shelter__name: '',
    ordering: '',
    page: 1, // Initial page
  });

  const [petListings, setPetListings] = useState({
    count: 0,
    next: null,
    previous: null,
    results: [],
});

const [applications, setApplications] = useState([]);

useEffect(() => {
  const fetchApplications = async () => {
    try {
      const applicationData = await getApplications();
      setApplications(applicationData.results);
    } catch (error) {
      console.error(error)
    }
  };

  fetchApplications();
}, []); 

  useEffect(() => {
    const fetchPetListings = async () => {
      try {
        const response = await searchPetListings(queryParams);
        setPetListings(response);
      } catch (error) {
        console.error('Error fetching pet listings:', error);
        navigate('/login');
      }
    };

    fetchPetListings();
  }, [queryParams, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQueryParams({
      ...queryParams,
      [name]: value,
      page: 1, // Reset page to 1 when other parameters change
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Fetch pet listings based on the updated query parameters
    // This will trigger the useEffect and update the displayed listings
  };

  const isApplicationExists = (petId) => {
    return applications.some((application) => application.pet === petId);
  };

  const fetchPage = async (url) => {
    try {
        const response = await fetch(url, {
            method: 'GET', // or 'POST', 'PUT', etc.
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json', // adjust the content type if needed
              // Other headers as needed
            },
            // You can include other options like body for POST requests, etc.
          });
      const data = await response.json();
      setPetListings(data);
    } catch (error) {
      console.error('Error fetching page:', error);
    }
  };

  const fetchNextPage = () => {
    if (petListings.next) {
      fetchPage(petListings.next);
    }
  };

  const fetchPreviousPage = () => {
    if (petListings.previous) {
      fetchPage(petListings.previous);
    }
  };
// Assuming you display 4 listings per page

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
                        <>
                  <Button variant="dark" className="mx-2" href="/profile/update">
                    My Account
                  </Button>
                  <Button variant="dark" className="mx-2" href="/view_applications">
                    My Applications
                  </Button>
                  <Button variant="dark" className="mx-2" href="/notifications">
                    Notifications
                  </Button>
                  <div className="d-flex">
                            <Logout />
                        </div>
                </>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
    <Container>
      <h2 className='my-2'>Search Pet Listings</h2>
      <Form onSubmit={handleSearch}>
        <Row>
          <Col md={3}>
            <Form.Group controlId="formAge">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter age"
                name="age"
                value={queryParams.age}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="formSize">
            <Form.Label>Size</Form.Label>
              <Form.Control
                as="select"
                name="size"
                value={queryParams.size}
                onChange={handleInputChange}
              >
                <option value="">Select Size</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="formGender">
            <Form.Label>Gender</Form.Label>
              <Form.Control
                as="select"
                name="gender"
                value={queryParams.gender}
                onChange={handleInputChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={3}>
              <Form.Group controlId="formOrdering">
                <Form.Label>Sort By</Form.Label>
                <Form.Control
                  as="select"
                  name="ordering"
                  value={queryParams.ordering}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="age">Age</option>
                  <option value="size">Size</option>
                </Form.Control>
              </Form.Group>
            </Col>
        </Row>
      </Form>

      <hr />
      <Container>
        {petListings.previous && (
          <Button onClick={fetchPreviousPage} className='mx-2' variant='outline-primary'>Previous Page</Button>
        
          )}
            {petListings.next && (
              <Button onClick={fetchNextPage} className='mx-2' variant='outline-primary'>Next Page</Button>
              
              )}
              <hr />
              </Container>

        <Row>
          {petListings.results.map((petListing) => (
            <Col key={petListing.id} md={3}>
              {/* Assuming you have a PetListingItem component */}
              <PetListingCard petListing={petListing} 
                hasApplication={isApplicationExists(petListing.id)}
              />
              {/* <h1>{petListing.name}</h1> */}
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SearchPage;
