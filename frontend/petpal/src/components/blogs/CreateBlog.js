// CreateBlog.js

import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Navbar, Nav } from 'react-bootstrap';
import { createBlogPost, currentUser } from '../../api'; // Update the path accordingly
import { useNavigate } from 'react-router-dom';
import Logout from '../accounts/Logout';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await currentUser();
        if (userData.user.is_seeker) {
            navigate('/')
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
        navigate('/login');
      }
    };

    fetchCurrentUser();
  }, []);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call the API function to create a new blog post
      await createBlogPost({ title, content });

      // Redirect to the blog list page after successful creation
      navigate('/all-blogs');
    } catch (error) {
      console.error('Error creating blog post:', error);
      // Handle error, show a message, etc.
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
            <Nav.Link href="/create-pet">Create a Pet</Nav.Link>
                <Nav.Link href="/all-blogs">My Blogs</Nav.Link>
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
      <h1 className="mt-4">Create a New Blog</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="blogTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" placeholder="Enter the title" value={title} onChange={handleTitleChange} required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="blogContent">
          <Form.Label>Content</Form.Label>
          <Form.Control as="textarea" rows={5} placeholder="Enter the content" value={content} onChange={handleContentChange} required />
        </Form.Group>

        <Button variant="dark" type="submit">
          Create Blog
        </Button>
      </Form>
    </Container>
    </>
  );
};

export default CreateBlog;
