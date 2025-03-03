// BlogDetail.js

import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Nav, Navbar } from 'react-bootstrap';
import { getBlogDetail, currentUser } from '../../api'; // Update the path accordingly
import { useParams, Link, useNavigate } from 'react-router-dom';
import Logout from '../accounts/Logout';

const BlogDetail = () => {
  const [blogPost, setBlogPost] = useState({});
  const { blogId } = useParams();
  const navigate = useNavigate()

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await currentUser();
        setUser(userData.user);
        console.log(user)
      } catch (error) {
        console.error('Error fetching current user:', error);
        navigate('/login');
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    // Fetch blog post details when the component mounts
    fetchBlogDetail();
  }, [blogId]);

  const fetchBlogDetail = async () => {
    try {
      const response = await getBlogDetail(blogId);
      setBlogPost(response); // Assuming the response is a single blog post
    } catch (error) {
      console.error('Error fetching blog details:', error);
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
              {user && user.is_shelter ? (
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
      <h1 className="mt-4">{blogPost.title}</h1>
      <p>
        <strong>By:</strong> {blogPost.creator}
      </p>
      <hr/>
      <p>{blogPost.content}</p>
      {/* Add more details based on your BlogPost model */}
      <Link to="/all-blogs">
        <Button variant="dark" className="m-3">
          Back to Blogs
        </Button>
      </Link>
      <Link to={`/profile/${blogPost.shelter}`}>
        <Button variant="dark" className="m-3">
          View Shelter
        </Button>
      </Link>
    </Container>
    </>
  );
};

export default BlogDetail;
