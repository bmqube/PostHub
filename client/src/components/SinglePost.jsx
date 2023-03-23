import React from "react";
import Card from "react-bootstrap/Card";
import axios from "axios";

export default function SinglePost({ post, user, effect, setEffect }) {
  const username = localStorage.getItem("name");
  const isAlreadyLogged = localStorage.getItem("userId");

  // console.log(post);

  const reactPost = async (e) => {
    e.preventDefault();
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
    setEffect(!effect);
  };

  return (
    <Card className="level2 mb-3">
      <Card.Body>
        <Card.Title>
          <a
            className="text-white"
            href={
              "/profile/" +
              (post.creator === isAlreadyLogged ? "" : post.creator)
            }
          >
            {user && user === "Self" ? username : post.createdBy}
          </a>
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          <small>
            {new Date(Date.parse(post.createdAt)).toLocaleString().split(",")}
            {/* {` (${post.privacy})`} */}
            <i
              class={`fa-solid ${
                post.privacy === "public" ? "fa-earth-asia" : "fa-user-group"
              }`}
            ></i>
          </small>
        </Card.Subtitle>
        <Card.Text>{post.message}</Card.Text>
        <Card.Link
          onClick={reactPost}
          href="#"
          className={`text-decoration-none ${
            post.reacted ? "text-warning" : "text-white"
          }`}
        >
          <i
            class={`${post.reacted ? "fa-solid" : "fa-regular"} fa-thumbs-up`}
          ></i>{" "}
          {post.reacted ? "Liked" : "Like"}
        </Card.Link>
        <Card.Link href="#" className="text-decoration-none text-white">
          <i class="fa-regular fa-comment"></i> Comment
        </Card.Link>
      </Card.Body>
    </Card>
  );
}
