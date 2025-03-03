import React, { useState, useEffect } from 'react';
import { Container, ListGroup, Navbar, Nav, Button } from 'react-bootstrap';
import Logout from '../accounts/Logout';
import { getNotifications, currentUser } from '../../api';
import { useNavigate } from 'react-router-dom';

const NotificationsPage = () => {
    const navigate = useNavigate()
  // Sample notifications data
  const [notifications, setNotifications] = useState({
    count: 0,
    next: null,
    previous: null,
    results: [],
});

useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await currentUser();
      } catch (error) {
        console.error('Error fetching current user:', error);
        navigate('/login')
      }
    };

    fetchCurrentUser();
  }, []);

useEffect(() => {
  const fetchNotifications = async () => {
    try {
      // Call the getNotifications function from your API
      const notificationsData = await getNotifications();

      // Update the state with the fetched notifications
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Fetch notifications when the component mounts
  fetchNotifications();
}, []);

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
    setNotifications(data);
  } catch (error) {
    console.error('Error fetching page:', error);
  }
};

const fetchNextPage = () => {
  if (notifications.next) {
    fetchPage(notifications.next);
  }
};

const fetchPreviousPage = () => {
  if (notifications.previous) {
    fetchPage(notifications.previous);
  }
};

const handleNotificationClick = (notificationId) => {
    // Navigate to the specific notification using the notificationId
    navigate(`/notifications/${notificationId}`);
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
                    <Button variant="dark" className="mx-2" href="/view_applications">
                    My Applications
                  </Button>
            <Button variant="dark" className="mx-2" href="/profile/update">
                    My Account
                  </Button>
                </div>
            </Navbar.Collapse>
        </Container>
    </Navbar>
    <Container className="notifications-page mt-5">
      <h1>Notifications</h1>
      {notifications.previous && (
                <Button onClick={fetchPreviousPage} className='mx-2'>Previous Page</Button>
            )}
            {notifications.next && (
            <Button onClick={fetchNextPage} className='mx-2'>Next Page</Button>
            )}
      <ListGroup className='mt-3'>
        {notifications.results.map((notification) => (
          <ListGroup.Item variant={notification.read_status ? '' : 'success'} key={notification.id} action 
          onClick={() => handleNotificationClick(notification.id)}>
            <div className="notification-message">{notification.content}</div>
            <div className="notification-timestamp">
              {new Date(notification.created_at).toLocaleString()}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
    </>
  );
};

export default NotificationsPage;
