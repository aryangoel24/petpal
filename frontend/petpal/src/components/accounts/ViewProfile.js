import React, { useState, useEffect } from 'react';
import { getProfile, currentUser, searchPetListings, postComment, getComments, getApplications } from '../../api.js'; // Update this path based on your project structure
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Card, Row, Col, Form, Button } from 'react-bootstrap';
import Logout from './Logout';
import PetListingCard from '../listings/PetListingItem.js';
import Comment from '../comments/Comment.js';

const ViewProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [petListings, setPetListings] = useState([]);
    const [currUser, setCurrUser] = useState(null)

    const { userId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const checkCurrentUser = async () => {
            try {
                const user = await currentUser();
                setCurrUser(user)
                // If the user is not logged in, navigate to the login page
            } catch (error) {
                console.error('Error checking current user:', error);
                navigate('/login')
            }
        };

        checkCurrentUser();
    }, [navigate]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userProfile = await getProfile(userId);
                setProfile(userProfile);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    const [comments, setComments] = useState({
        count: 0,
        next: null,
        previous: null,
        results: [],
    });
    const [newComment, setNewComment] = useState('');

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
          setComments(data);
        } catch (error) {
          console.error('Error fetching page:', error);
        }
      };
    
      const fetchNextPage = () => {
        if (comments.next) {
          fetchPage(comments.next);
        }
      };
    
      const fetchPreviousPage = () => {
        if (comments.previous) {
          fetchPage(comments.previous);
        }
      };

      useEffect(() => {
        const fetchComments = async () => {
            try {
                if (profile && profile.user) {
                    const shelterComments = await getComments({ shelter: profile.user.id });
                    setComments(shelterComments);
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };
    
        fetchComments();
    }, [newComment, profile]);

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        try {
            const commentData = {
                text: newComment,
                shelter: profile.user.id, // Assuming 'name' is a unique identifier for the shelter
            };

            await postComment(commentData);
            // Refetch comments to update the UI
            const shelterComments = await getComments();
            setComments(shelterComments);
            setNewComment('');
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    useEffect(() => {
        const fetchPetListings = async () => {
          try {
            if (profile && profile.name) {
              const queryParams = {
                shelter__name: profile.name,
              };
    
              const listings = await searchPetListings(queryParams);
              setPetListings(listings.results);
            }
          } catch (error) {
            console.error('Error fetching pet listings:', error);
          }
        };
    
        fetchPetListings();
      }, [profile]);

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (error) {
        return <p>Error loading profile: {error}</p>;
    }

    if (!profile) {
        return <p>Profile not found</p>;
    }

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
                            <Logout />
                  <Button variant="dark" className="mx-2" href="/notifications">
                    Notifications
                  </Button>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="mt-5">
                <h1 className="display-4">{profile.name}</h1>
                <Card>
                    <Card.Body>
                        <Card.Text>
                                        <strong>Location:</strong> {profile.location}
                            </Card.Text>
                        {profile && profile.user.is_shelter && <Card.Text>
                                        <strong>Mission Statement:</strong> {profile.mission_statement}
                            </Card.Text>}
                    </Card.Body>
                </Card>
            </Container>

            {/* Display pet listings for the shelter if it is a shelter */}
            {profile.user.is_shelter && (
                <>
              <Container className="mt-5">
                <h2 className="display-5">Some pets at {profile.name}</h2>
                <Row>
                  {petListings.map((petListing) => (
                      <Col key={petListing.id} md={3}>
                      {/* Assuming you have a PetListingItem component */}
                      <PetListingCard petListing={petListing} />
                      {/* <h1>{petListing.name}</h1> */}
                    </Col>
                  ))}
                </Row>
              </Container>
              <Container className="mt-5">
                        <h2 className="display-5">Comments</h2>
                        <Row>
              {comments.results.map((comment) => (
                <Col key={comment.id} md={3}>
                  {/* Use the Comment component */}
                  <Comment comment={comment} />
                </Col>
              ))}
            </Row>
            {comments.previous && (
                <Button onClick={fetchPreviousPage} className='mx-2'>Previous Page</Button>
            )}
            {comments.next && (
            <Button onClick={fetchNextPage} className='mx-2'>Next Page</Button>
            )}
                        <Form onSubmit={handleCommentSubmit} className='mt-5'>
                            <Form.Group>
                                <Form.Label>Add a Comment</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={newComment}
                                    onChange={handleCommentChange}
                                />
                            </Form.Group>
                            <Button variant="dark" type="submit" className='my-2'>
                                Post Comment
                            </Button>
                        </Form>
                    </Container>
                  </>
            )}
        </div>
    );
};

export default ViewProfile;
