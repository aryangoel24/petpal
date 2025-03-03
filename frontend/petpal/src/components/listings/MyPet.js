import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; 
import { deletePetListing } from '../../api';

const MyPet = ({ petListing }) => {
  const navigate = useNavigate();
  if (!petListing) {
    // Handle the case where petListing is undefined
    return null;
  }

  const { id, name, status, breed, age, size, gender, photos } = petListing || {};  

  const handleDelete = async () => {
    try {
      // Call the deletePetListing function
      await deletePetListing(id);
  
      // Handle the success, e.g., show a success message or redirect the user
      console.log('Pet listing deleted successfully');
      navigate(0)
    } catch (error) {
      console.error('Error deleting pet listing:', error);
      // Handle the error, e.g., show an error message to the user
    }
  };

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
        <Button variant="primary" href={`/listings/${id}/update`} className='mx-2' >Update</Button>
        <Button variant="danger" onClick={handleDelete} className='mx-2' >Delete</Button>
      </Card.Body>
    </Card>
  );
};

export default MyPet;
