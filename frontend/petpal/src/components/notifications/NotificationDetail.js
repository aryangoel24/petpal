import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import Logout from '../accounts/Logout';
import { getNotificationDetails, currentUser, deleteNotif } from '../../api';
import { useParams, useNavigate } from 'react-router-dom';

const NotificationDetailPage = () => {
  const { notificationId } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchNotificationDetail = async () => {
      try {
        // Call the getNotificationDetails function from your API
        const notificationData = await getNotificationDetails(notificationId);

        // Update the state with the fetched notification details
        setNotification(notificationData);
      } catch (error) {
        console.error('Error fetching notification details:', error);
      }
    };

    // Fetch notification details when the component mounts
    fetchNotificationDetail();
  }, [notificationId]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await currentUser();
        setUser(userData)
      } catch (error) {
        console.error('Error fetching current user:', error);
        navigate('/login')
      }
    };

    fetchCurrentUser();
  }, []);

  const handleViewClick = () => {
    if (notification && notification.associated_model_type === 'comment') {
      navigate(`/profile/${user.user.id}`)
    }
    // Check if the notification has an associated model URL
    else if (notification && notification.associated_model_url) {
      // Redirect to the associated model's URL
      navigate(notification.associated_model_url);
    }
  };

  const handleDeleteNotification = async () => {
    try {
      await deleteNotif(notification.id);
      // After successfully deleting the notification, redirect to the notification list page
      navigate('/notifications');
    } catch (error) {
      console.error('Error deleting notification:', error);
      // Handle error, e.g., display an error message to the user
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
                  <Button variant="dark" className="mx-2" href="/notifications">
                    Notifications
                  </Button>
              <Logout />
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="notification-detail-page mt-5">
        {notification ? (
          <>
            <h1>Notification Detail</h1>
            <div className="notification-message">{notification.content}</div>
            <div className="notification-timestamp">
              {new Date(notification.created_at).toLocaleString()}
            </div>
            {notification.associated_model_url && (
              <>
              <Button variant="primary" className='m-2' onClick={handleViewClick}>
                View
              </Button>
              <Button variant="danger" className='m-2' onClick={handleDeleteNotification}>
                Delete
              </Button>
              </>
            )}
          </>
        ) : (
          <p>Loading...</p>
        )}
      </Container>
    </>
  );
};

export default NotificationDetailPage;
