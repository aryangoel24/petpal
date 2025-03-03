import React, { useState } from 'react';
import { Navbar, Nav, Button, Container, Row, Col, Form } from 'react-bootstrap';
import { getToken } from '../../api'; // Import your getToken function
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate(); 
  const { setToken } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const token = await getToken(formData.username, formData.password);
      // Assuming your getToken function returns an object with an 'access' property for the token
      setToken(token.access);

      localStorage.setItem('token', token.access);
      
      console.log(token.access)
      navigate('/');
      // Redirect or perform any other action upon successful login
    } catch (error) {
      console.error(error)
      setError('Invalid credentials. Please try again.'); // Update the error state
    }
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar color-white">
        <Container>
          <Navbar.Brand href="/">PetPal</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarResponsive" />
          <Navbar.Collapse id="navbarResponsive">
            <Nav className="me-auto mb-2 mb-lg-0">
              <Nav.Link href="/">Home</Nav.Link>
            </Nav>
            <div className="d-flex">
              <Button variant="dark" className="mx-2 login" href="/login">Log in</Button>
              <Button variant="dark" className="mx-2 register" href="/register_seeker">Sign up as a Pet Seeker</Button>
              <Button variant="dark" className="mx-2 register" href="/register_shelter">Sign up as a Pet Shelter</Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main content */}
      <main>
        <Container>
          <Row className="justify-content-center">
            <Col md={6}>
              <h2 className="mt-5 mb-3">Login</h2>
              <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        {error && <p className="text-danger">{error}</p>}

                <Button variant="outline-dark" type="submit" className="mx-2 btn-custom">
                  Login
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </main>

      {/* Bootstrap scripts */}
      {/* ... (same as provided) */}
    </div>
  );
};

export default Login;
