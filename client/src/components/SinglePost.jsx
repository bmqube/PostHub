import React from "react";
import Card from "react-bootstrap/Card";
import axios from "axios";

export default function SinglePost({ post, user, effect, setEffect }) {
  const username = localStorage.getItem("name");
  const isAlreadyLogged = localStorage.getItem("userId");

  // console.log(post);

  const reactPost = async (e) => {
    e.preventDefault();
    // console.log(post._id);
    let response = await axios.post(
      "http://localhost:8000/post/react/",
      {
        postId: post._id,
      },
      {
        headers: {
          userId: isAlreadyLogged,
        },
      }
    );
    // console.log(response);
    setEffect(!effect);
  };

  return (
    <Card className="level2 mb-3">
      <Card.Body>
        <Card.Title>
          {user && user === "Self" ? username : post.createdBy}
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {new Date(Date.parse(post.createdAt)).toLocaleString().split(",")}
          {` (${post.privacy})`}
        </Card.Subtitle>
        <Card.Text>{post.message}</Card.Text>
        <Card.Link
          onClick={reactPost}
          href="#"
          className={`text-decoration-none text-${
            post.reacted ? "primary" : "warning"
          }`}
        >
          {post.reacted ? "Liked" : "Like"}
        </Card.Link>
        <Card.Link href="#" className="text-decoration-none text-warning">
          Comment
        </Card.Link>
      </Card.Body>
    </Card>
  );
}
