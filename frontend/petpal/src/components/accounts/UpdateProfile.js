import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Form, Button, Container, Row, Col } from 'react-bootstrap';
import { currentUser, updateProfile, deleteProfile, searchPetListings } from '../../api'; // Update this import with the correct path
import { useNavigate } from 'react-router-dom';
import Logout from './Logout';
import MyPet from '../listings/MyPet';

const UpdateProfile = () => {
    const navigate = useNavigate();
    const [petListings, setPetListings] = useState({
      count: 0,
      next: null,
      previous: null,
      results: [],
  });
  const [userData, setUserData] = useState({
    user: {
      id: null,
      username: '',
      email: '',
      is_pet_seeker: false,
      is_shelter: false,
    },
    name: '',
    location: '',
    mission_statement: '',
    profile_picture: null,
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const fetchedUserData = await currentUser();
        setUserData(fetchedUserData);
      } catch (error) {
        console.error('Error fetching current user:', error);
        navigate('/login');
      }
    };

    fetchCurrentUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setUserData({
      ...userData,
      profile_picture: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(userData);
      console.log('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProfile();
      console.log('Profile deleted successfully!');
      // Redirect to the login page after deletion
      navigate('/login');
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  useEffect(() => {
    const fetchPetListings = async () => {
      try {
        if (userData && userData.name) {
          const queryParams = {
            shelter__name: userData.name,
          };

          const listings = await searchPetListings(queryParams);
          setPetListings(listings);
        }
      } catch (error) {
        console.error('Error fetching pet listings:', error);
      }
    };

    fetchPetListings();
  }, [userData]);


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

  return (
    <div>
        <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar color-white">
                <Container>
                    <Navbar.Brand href="/">PetPal</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarResponsive" />
                    <Navbar.Collapse id="navbarResponsive">
                    <Nav className="me-auto mb-2 mb-lg-0">
              <Nav.Link href="/">Home</Nav.Link>
              {userData && userData.user.is_shelter ? (
                // If the user is a seeker, show "Adopt a Pet" link
                <>
                <Nav.Link href="/create-pet">Create a Pet</Nav.Link>
                <Nav.Link href="/create-blog">Write a Blog</Nav.Link>
                </>
                ) : (
                  // If the user is not a seeker, show "Create a Pet" link
                  <>
                  <Nav.Link href="/search">Adopt a Pet</Nav.Link>
                  <Nav.Link href="/shelters">View Shelters</Nav.Link>
                  <Nav.Link href="/all-blogs">Blogs</Nav.Link>
                  </>
              )}
            </Nav>
                        <div className="d-flex">
                        <Button variant="dark" className="mx-2" href="/view_applications">
                    My Applications
                  </Button>
                  <Button variant="dark" className="mx-2" href="/notifications">
                    Notifications
                  </Button>
                            <Logout />
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
    <Container>
      <h2 className='mt-5'>Update Profile</h2>
      <Form onSubmit={handleSubmit}>
        {userData.user.is_shelter && (
          <>
            <Form.Group controlId="formName">
              <Form.Label>Shelter Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter shelter name"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location"
                name="location"
                value={userData.location}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formMissionStatement">
              <Form.Label>Mission Statement</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter mission statement"
                name="mission_statement"
                value={userData.mission_statement}
                onChange={handleInputChange}
              />
            </Form.Group>
          </>
        )}

        {userData.user.is_pet_seeker && (
          <>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location"
                name="location"
                value={userData.location}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formProfilePicture">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control
                type="file"
                name="profile_picture"
                onChange={handleFileChange}
              />
            </Form.Group>
          </>
        )}

        <Button className='mt-3' variant="dark" type="submit">
          Update Profile
        </Button>
      </Form>
      <div className="mt-3">
        <Button variant="danger" onClick={handleDelete}>
          Delete Profile
        </Button>
      </div>
    </Container>
    {userData.user.is_shelter && (
                <>
              <Container className="mt-5">
                <h2 className="display-5">My Pets</h2>
                <Container className='my-3'>

        {petListings.previous && (
          <Button onClick={fetchPreviousPage} className='mx-2' variant='outline-primary'>Previous Page</Button>
          
          )}
            {petListings.next && (
              <Button onClick={fetchNextPage} className='mx-2' variant='outline-primary'>Next Page</Button>
              
              )}
              </Container>
                <Row>
                  {petListings.results.map((petListing) => (
                      <Col key={petListing.id} md={3}>
                      {/* Assuming you have a PetListingItem component */}
                      <MyPet petListing={petListing} />
                      {/* <h1>{petListing.name}</h1> */}
                    </Col>
                  ))}
                </Row>
              </Container>
              </>
              )}
    </div>
  );
};

export default UpdateProfile;
