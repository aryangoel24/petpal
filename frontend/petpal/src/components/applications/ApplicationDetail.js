import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { getApplicationDetails, getComments, postComment, currentUser, updateApplicationStatus } from '../../api.js'; // Import the function you provided
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Container, ListGroup, Button, Row, Col, Form } from 'react-bootstrap';
import { Navbar, Nav } from 'react-bootstrap';
import Logout from '../accounts/Logout';
import Comment from '../comments/Comment.js';


const ApplicationDetails = () => {
    const [applicationDetails, setApplicationDetails] = useState(null);
    const [userDetails, setUserDetails] = useState(null);

    const navigate = useNavigate();

    const { applicationId } = useParams();

    useEffect(() => {
        const fetchApplicationDetails = async () => {
            try {
                const details = await getApplicationDetails(applicationId);
                setApplicationDetails(details);
            } catch (error) {
                // Handle error as needed
                console.error('Error fetching application details:', error);
            }
        };

        fetchApplicationDetails();
    }, [applicationId]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const details = await currentUser();
                console.log(details['user']);
                setUserDetails(details['user']);
            } catch (error) {
                // Handle error as needed
                console.error('Error fetching user details:', error);
                navigate('/login')
            }
        };

        fetchUserDetails();
    }, []);

    const handleChange = async (status) => {
        try {
            const response = await updateApplicationStatus(applicationId, status);

            // Navigate to the application details page
            navigate(`/view_applications`);

        } catch (error) {
            console.error('Error updating application status:', error);
        }
    };




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
                const shelterComments = await getComments({ 'application': applicationId });
                setComments(shelterComments);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, [applicationId]);

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        try {
            const commentData = {
                text: newComment,
                application: applicationId, // Assuming 'name' is a unique identifier for the shelter
            };

            await postComment(commentData);
            // Refetch comments to update the UI
            const shelterComments = await getComments({ 'application': applicationId });
            setComments(shelterComments);
            setNewComment('');
        } catch (error) {
            console.error('Error posting comment:', error);
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
            <Container className='mt-5'>
                <Card>
                    <Card.Body>
                        <Card.Title>Application Details</Card.Title>
                        {applicationDetails && (
                            <>
                                <Card.Text>ApplicationId: {applicationDetails.id ?? "Default Name"}</Card.Text>
                                <Card.Text>PetId: {applicationDetails.pet ?? "Default Status"}</Card.Text>
                                <Card.Text>Status: {applicationDetails.status ?? "Default Description"}</Card.Text>
                                <Card.Text>Description: {applicationDetails.description ?? "Default Description"}</Card.Text>
                                <Card.Text>Created At: {new Date(applicationDetails.creation_time).toLocaleString() ?? "Default Description"}</Card.Text>
                                <Card.Text>Last Updated: {new Date(applicationDetails.last_update_time).toLocaleString() ?? "Default Description"}</Card.Text>
                                {userDetails && userDetails.is_pet_seeker && applicationDetails.status == 'pending' && (
                                    <Button variant='dark' onClick={() => {handleChange('withdrawn')}}>
                                        WithDraw Application
                                    </Button>
                                )}
                                {userDetails && userDetails.is_shelter && applicationDetails.status == 'pending' && (
                                    <Button variant='dark' onClick={() => {handleChange('accepted')}}>
                                        Accept Application
                                    </Button>
                                )}
                            </>
                        )}

                    </Card.Body>
                </Card>
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
                        <Button variant="dark" type="submit" className='mt-2'>
                            Post Comment
                        </Button>
                    </Form>
                </Container>
            </Container>

        </>

    );
};

export default ApplicationDetails;