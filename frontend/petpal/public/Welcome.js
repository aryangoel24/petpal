// Frontend/src/Welcome.js
import React from 'react';
import { Navbar, Nav, Button, Container, Row, Col, Image } from 'react-bootstrap';

const Welcome = () => {
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
            </Nav>
            <div className="d-flex">
              <Button variant="outline-dark" className="mx-2 login" href="/login">Log in</Button>
              <Button variant="dark" className="mx-2 register" href="/register_seeker">Sign up as a Pet Seeker</Button>
              <Button variant="dark" className="mx-2 register" href="/register_shelter">Sign up as a Pet Shelter</Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main>
        <Container className="mt-5">
          <Row className="justify-content-center">
            <Col xs={12} lg={2} className="m-4 d-none d-lg-block">
              <Image src="pet1.jpg" alt="Dog 1" fluid className="corner" />
            </Col>
            <Col xs={12} lg={5} className="m-4">
              <Image src="doggies.jpeg" alt="Dog 1" fluid className="center-pic" />
            </Col>
            <Col xs={12} lg={2} className="m-4 d-none d-lg-block">
              <Image src="pet2.jpg" alt="Dog 2" fluid className="corner" />
            </Col>
          </Row>
          <Row className="justify-content-center text-center">
            <Col xs={12} md={6} className="m-4">
              <h1>Welcome to PetPal</h1>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col xs={12} lg={2} className="m-4 d-none d-lg-block">
              <Image src="pet2.jpg" alt="Dog 4" fluid className="corner" />
            </Col>
            <Col xs={12} lg={5} className="m-4">
              <Image src="cats.jpg" alt="Dog 1" fluid className="center-pic" />
            </Col>
            <Col xs={12} lg={2} className="m-4 d-none d-lg-block">
              <Image src="pet1.jpg" alt="Dog 3" fluid className="corner" />
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default Welcome;
