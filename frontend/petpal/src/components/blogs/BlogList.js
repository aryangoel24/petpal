// BlogList.js

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Navbar, Button } from 'react-bootstrap';
import { getBlogPosts, currentUser } from '../../api';
import Logout from '../accounts/Logout';
import { useNavigate } from 'react-router-dom';

const BlogList = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const navigate = useNavigate()

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await currentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching current user:', error);
        navigate('/login');
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    // Fetch blog posts when the component mounts
    fetchBlogPosts();
  }, [user]);

  const fetchBlogPosts = async () => {
    try {
        const params = {}
        if (user.user.is_shelter) {
            params.shelter = user.user.id
        }
        console.log(params)
      const response = await getBlogPosts(params);
      setBlogPosts(response); // Assuming the response is an array of blog posts
    } catch (error) {
      console.error('Error fetching blog posts:', error);
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
              {user && user.user.is_shelter ? (
                // If the user is a seeker, show "Adopt a Pet" link
                <>
                <Nav.Link href="/create-pet">Create a Pet</Nav.Link>
                <Nav.Link href="/create-blog">Write a Blog</Nav.Link>
                <Nav.Link href="/all-blogs">My Blogs</Nav.Link>
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
      {user && user.user.is_shelter ? (<h1 className="mt-4">Your Blogs</h1>) : (<h1 className="mt-4">Blogs by Shelters!</h1>)}
      <Row>
        {blogPosts.map((blogPost) => (
            <Col key={blogPost.id} lg={4} md={6} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{blogPost.title}</Card.Title>
                <Card.Text>by {blogPost.creator}</Card.Text>
                {/* Add more details based on your BlogPost model */}
                <Button variant="dark" onClick={() => { navigate(`/blogposts/${blogPost.id}/`)}} className='m-2'>View More</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
        </>
  );
};

export default BlogList;
