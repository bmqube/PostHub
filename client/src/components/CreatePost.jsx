import React, { useState } from "react";
import { Button, InputGroup } from "react-bootstrap";
import Form from "react-bootstrap/Form";

export default function CreatePost() {
  const isAlreadyLogged = localStorage.getItem("userId");
  const [message, setMessage] = useState("");
  return (
    <InputGroup className="mb-3">
      <Form.Control
        as="textarea"
        rows={2}
        placeholder="What's on your mind?"
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        className="level3 text-white"
      />
      <Button variant="outline-warning" id="button-addon2">
        Post
      </Button>
    </InputGroup>
  );
}
