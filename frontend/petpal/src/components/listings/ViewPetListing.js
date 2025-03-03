// DetailPetListing.js

import React, { useState, useEffect } from 'react';
import { getPetListingDetails, currentUser, getApplications } from '../../api'; // Update with your actual API function
import { Container, Navbar, Nav, Modal, Button, Image } from 'react-bootstrap';
import Logout from '../accounts/Logout';
import { useParams, useNavigate } from 'react-router-dom';

const ViewPetListing = () => {
  const [petListings, setPetListings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  const { listingId } = useParams();

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
    const fetchCurrentUser = async () => {
      try {
        const userData = await currentUser();
      } catch (error) {
        console.error('Error fetching current user:', error);
        navigate('/login')
      }
    };

    fetchCurrentUser();
  }, []);

  const handleClick = () => {
    navigate('/create_application', {state: {petId: listingId}});
  }

  const isApplicationExists = (petId) => {
    return applications.some((application) => application.pet === petId);
  };

  useEffect(() => {
    const fetchPetListings = async () => {
      try {
        const petListingsData = await getPetListingDetails(listingId); // Update with your actual API function
        setPetListings(petListingsData);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchPetListings();
  }, [listingId]); // Include listingId in the dependency array

  return (
    <div>
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
                  <Button variant="dark" className="mx-2" href="/notifications">
                    Notifications
                  </Button>
              <Logout />
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mt-4 text-center">
        <h1>Pet Listings</h1>
        {loading && <p>Loading...</p>}
        {error && <p>This pet listing no longer exists</p>}
        {!loading && !error && (
          <>
            {petListings.photos && <div><Image src={petListings.photos} rounded fluid width="300"/></div>}
            <h3>{petListings.name}</h3>
            <p><strong>Age:</strong> {petListings.age}</p>
            <p><strong>Breed:</strong> {petListings.breed}</p>
            <p><strong>Size:</strong> {petListings.size}</p>
            {applications.some((application) => application.pet === petListings.id) ? (
          <Button disabled variant='dark'>Application Submitted</Button>
        ):(
          <Button variant="primary" onClick={handleClick}>Adopt</Button>
        )}
          </>
        )}
      </Container>
    </div>
  );
};

export default ViewPetListing;
