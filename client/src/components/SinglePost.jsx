import React from "react";
import Card from "react-bootstrap/Card";

export default function SinglePost(post) {
  return (
    <Card className="level2 mb-3">
      <Card.Body>
        <Card.Title>PostStar</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Time</Card.Subtitle>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Card.Link href="#" className="text-decoration-none text-warning">
          Like
        </Card.Link>
        <Card.Link href="#" className="text-decoration-none text-warning">
          Comment
        </Card.Link>
      </Card.Body>
    </Card>
  );
}
