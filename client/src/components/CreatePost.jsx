import React, { useState } from "react";
import { Button, InputGroup } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import axios from "axios";

export default function CreatePost({ effect, setEffect }) {
  const isAlreadyLogged = localStorage.getItem("userId");
  const [message, setMessage] = useState("");

  const createPost = async (e) => {
    e.preventDefault();

    if (message) {
      const data = {
        message: message,
      };

      // console.log(birthdate);

      let response = await axios.post(
        "http://localhost:8000/post/create",
        data,
        {
          headers: {
            userId: isAlreadyLogged,
          },
        }
      );

      console.log(response);

      if (response.data.code === "SUCCESS") {
        setMessage("");
        setEffect(!effect);
      }
    }
  };
  return (
    <InputGroup className="mb-3">
      <Form.Control
        as="textarea"
        rows={2}
        placeholder="What's on your mind?"
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        value={message}
        className="level3 text-white"
      />
      <Button variant="outline-warning" onClick={createPost} id="button-addon2">
        Post
      </Button>
    </InputGroup>
  );
}
