import React from "react";
import Card from "react-bootstrap/Card";
import axios from "axios";

export default function SinglePost({ post, user, effect, setEffect }) {
  const username = localStorage.getItem("name");
  const isAlreadyLogged = localStorage.getItem("userId");

  // console.log(post);

  function formatTime(postDate) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let now = new Date();
    postDate = new Date(postDate);
    const diff = Math.abs(now - postDate);
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;
    const year = 365 * day;

    if (diff < minute) {
      return "Just now";
    } else if (diff < hour) {
      return Math.floor(diff / minute) + "m";
    } else if (diff < day) {
      return Math.floor(diff / hour) + "h";
    } else if (diff < week) {
      return Math.floor(diff / day) + "d";
    } else if (diff < month) {
      return Math.floor(diff / week) + "w";
    } else {
      const hour = (postDate.getHours() % 12).toString().padStart(2, "0");
      const minute = postDate.getMinutes().toString().padStart(2, "0");
      const ampm = postDate.getHours() >= 12 ? "PM" : "AM";
      return `${
        monthNames[postDate.getMonth()]
      } ${postDate.getDate()} at ${hour}:${minute} ${ampm}`;
    }
  }

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
            {formatTime(Date.parse(post.createdAt))}{" "}
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
        <Card.Link
          href={`/post/${post._id}`}
          className="text-decoration-none text-white"
        >
          <i class="fa-regular fa-comment"></i> Comment
        </Card.Link>
      </Card.Body>
    </Card>
  );
}
