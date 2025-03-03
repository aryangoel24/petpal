import React from 'react';
import { Card } from 'react-bootstrap';

const Comment = ({ comment }) => {
  const { user_name, created_at, text } = comment;
  const formattedDate = new Date(created_at).toLocaleString();

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Subtitle className="mb-2">{user_name}</Card.Subtitle>
        <Card.Text>{text}</Card.Text>
        <Card.Text className="text-muted">Created at: {formattedDate}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Comment;
