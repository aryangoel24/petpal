import React, { useState, useEffect } from 'react';
import { getShelters, currentUser } from '../../api.js';
import ShelterCard from './ShelterCard';
import { Container, Navbar, Nav, Button, Card } from 'react-bootstrap';
import Logout from './Logout';
import { useNavigate } from 'react-router-dom';

const ShelterListComponent = () => {
    // const [shelters, setShelters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    const [shelters, setShelters] = useState({
        count: 0,
        next: null,
        previous: null,
        results: [],
    });

    useEffect(() => {
        const checkCurrentUser = async () => {
            try {
                const user = await currentUser();
                // If the user is not logged in, navigate to the login page
            } catch (error) {
                console.error('Error checking current user:', error);
                navigate('/login')
            }
        };

        checkCurrentUser();
    }, [navigate]);

    const fetchPage = async (url) => {
        try {
          const response = await fetch(url);
          const data = await response.json();
          setShelters(data);
        } catch (error) {
          console.error('Error fetching page:', error);
        }
      };
    
      const fetchNextPage = () => {
        if (shelters.next) {
          fetchPage(shelters.next);
        }
      };
    
      const fetchPreviousPage = () => {
        if (shelters.previous) {
          fetchPage(shelters.previous);
        }
      };

    useEffect(() => {
        const fetchShelters = async () => {
            try {
                const sheltersData = await getShelters();
                setShelters(sheltersData);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchShelters();
    }, []); // Empty dependency array means this effect runs once after the initial render

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
            <Container className='mt-5'>
            <h1>Shelters List</h1>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {!loading && !error && (
                <ul>
                    {shelters.results.map((shelter, index) => (
                        <ShelterCard key={index} shelter={shelter} />
                    ))}
                </ul>
            )}
            {shelters.previous && (
                <button onClick={fetchPreviousPage}>Previous Page</button>
            )}
            {shelters.next && (
            <button onClick={fetchNextPage}>Next Page</button>
            )}
</Container>

        </div>
    );
};

export default ShelterListComponent;