import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; 

const PetListingCard = ({ petListing, hasApplication }) => {
  const navigate = useNavigate();
  if (!petListing) {
    // Handle the case where petListing is undefined
    return null;
  }

  const { id, name, status, breed, age, size, gender, photos } = petListing || {};  

  const handleClick = () => {
    navigate('/create_application', {state: {petId: petListing.id}});
  }

  return (
    <Card style={{ width: '18rem' }}>
      {/* Assuming you have an image URL in the petListing object */}
      <Card.Img variant="top" src={photos} alt={name} />

      <Card.Body>
        <Card.Title>{name || 'Unknown Name'}</Card.Title>
        <Card.Text>
          <strong>Status:</strong> {status || 'Unknown'}
          <br />
          <strong>Breed:</strong> {breed || 'Unknown'}
          <br />
          <strong>Age:</strong> {age || 'Unknown'}
          <br />
          <strong>Size:</strong> {size || 'Unknown'}
          <br />
          <strong>Gender:</strong> {gender || 'Unknown'}
        </Card.Text>
        {hasApplication ? (
          <Button disabled variant='dark' className='m-2'>Application Submitted</Button>
        ):(
          <Button variant="primary" onClick={handleClick} className='m-2'>Adopt</Button>
        )}
        <Button variant="dark" onClick={() => { navigate(`/listings/${id}`)}} className='m-2'>View More</Button>
      </Card.Body>
    </Card>
  );
};

export default PetListingCard;
