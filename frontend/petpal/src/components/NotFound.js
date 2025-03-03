// NotFound.js
import React from 'react';
import { Container, Row, Col, Nav, Navbar } from 'react-bootstrap';

const NotFound = () => {
  return (
    <>
    <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar color-white">
        <Container>
          <Navbar.Brand href="/">PetPal</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarResponsive" />
          <Navbar.Collapse id="navbarResponsive">
            <Nav className="me-auto mb-2 mb-lg-0">
              <Nav.Link href="/">Home</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    <Container>
      <Row className="justify-content-center" style={{ marginTop: '50px' }}>
        <Col xs={8} className="text-center">
          <h1 className="text-danger">404 Not Found</h1>
          <p>The page you are looking for does not exist.</p>
        </Col>
      </Row>
    </Container>
    </>
  );
};

export default NotFound;
