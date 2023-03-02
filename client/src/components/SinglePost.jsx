import React from "react";
import Card from "react-bootstrap/Card";

export default function SinglePost({ post, user }) {
  const username = localStorage.getItem("name");
  return (
    <Card className="level2 mb-3">
      <Card.Body>
        <Card.Title>
          {user && user === "Self" ? username : post.createdBy}
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {new Date(Date.parse(post.createdAt)).toLocaleString().split(",")}
        </Card.Subtitle>
        <Card.Text>{post.message}</Card.Text>
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
