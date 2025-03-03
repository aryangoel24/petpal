import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ShelterCard = ({ shelter }) => {
    const navigate = useNavigate();

    const handleLearnMore = () => {
        navigate(`/profile/${shelter.user.id}`);
    }

  return (
    <Card style={{ width: '18rem', margin: '16px' }}>
      <Card.Body>
        <Card.Title>{shelter.name}</Card.Title>
        <Card.Text>
          <strong>Location:</strong> {shelter.location}
        </Card.Text>
        <Button variant="dark" onClick={handleLearnMore}>Learn More</Button>
      </Card.Body>
    </Card>
  );
};

export default ShelterCard;