import React, { useState, useEffect } from 'react';
import { getApplications } from '../../api'; // Adjust the path accordingly
import { Container, ListGroup, Button } from 'react-bootstrap';
import { Navbar, Nav } from 'react-bootstrap';
import Logout from '../accounts/Logout';
import { useNavigate } from 'react-router-dom';

const ViewApplications = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const [applications, setApplications] = useState({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });

  const handleClick = (id) => {
    navigate(`/applications/${id}`);
  }

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
      setApplications(data);
    } catch (error) {
      console.error('Error fetching page:', error);
    }
  };

  const fetchNextPage = () => {
    if (applications.next) {
      fetchPage(applications.next);
    }
  };

  const fetchPreviousPage = () => {
    if (applications.previous) {
      fetchPage(applications.previous);
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const applicationData = await getApplications();
        console.log(applicationData)
        setApplications(applicationData);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchApplications();
  }, []); 

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
            <Button variant="dark" className="mx-2" href="/profile/update">
                    My Account
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
        <h1 className="mt-4">Applications List</h1>
        {loading && <p>Loading...</p>}
        {!loading && !error && applications.results && (
          <>
            <ListGroup className="mt-4">
              {applications.results.map((application) => (
                <ListGroup.Item key={application.id}>
                  <h5>Application ID: {application.id}</h5>
                  <p>Status: {application.status}</p>
                  <p>Description: {application.description}</p>
                  <Button variant='dark' onClick={() => {handleClick(application.id)}}>
                    More Information
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <div className="mt-4 d-flex justify-content-between">
                {applications.previous && (
                  <Button variant='dark' onClick={fetchPreviousPage}>
                    Previous Page
                  </Button>
                )}
                {applications.next && (
                  <Button variant='dark' onClick={fetchNextPage}>
                    Next Page
                  </Button>
                )}

            </div>
          </>
        )}
      </Container>
    </>
  );
};

export default ViewApplications;