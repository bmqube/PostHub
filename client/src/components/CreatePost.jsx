import React, { useState } from "react";
import { Button, InputGroup } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { MDBBtn, MDBInputGroup, MDBTextArea } from "mdb-react-ui-kit";

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
    <MDBInputGroup style={{ width: "100%" }} className="mb-3">
      <Form.Control
        as="textarea"
        style={{ height: "100%" }}
        rows={2}
        placeholder="What's on your mind?"
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        value={message}
        className="level3 text-white"
      />
      {/* <MDBTextArea
        className="level3 text-white"
        label="What's on your mind?"
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        value={message}
        id="textAreaExample"
        rows={3}
      /> */}
      <MDBBtn color="warning" outline onClick={createPost} id="button-addon2">
        Post
      </MDBBtn>
    </MDBInputGroup>
  );
}
