import React, { useState, useEffect } from "react";
import { Button, InputGroup } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { MDBBtn, MDBInputGroup, MDBTextArea } from "mdb-react-ui-kit";

export default function CreatePost({ effect, setEffect }) {
  const isAlreadyLogged = localStorage.getItem("userId");
  const dp = localStorage.getItem("dp");
  const username = localStorage.getItem("name");
  const [message, setMessage] = useState("");
  const [privacy, setPrivacy] = useState("public");

  const handleSelectChange = (event) => {
    setPrivacy(event.target.value);
  };

  const createPost = async (e) => {
    e.preventDefault();

    if (message) {
      const data = {
        message: message,
        privacy: privacy,
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

  useEffect(() => {
    if (!dp) {
      async function getData() {
        let response = await axios.get("http://localhost:8000/profile/my", {
          headers: {
            userId: isAlreadyLogged,
          },
        });

        localStorage.setItem("dp", response.data.data.dp);
        dp = response.data.data.dp;
      }
      getData();
    }
  }, []);

  return (
    <>
      <div className="d-flex">
        <img
          src={`http://localhost:8000/public/${dp}`}
          className="border border-3 border-warning rounded-circle mb-2"
          alt=""
          width={50}
          height={50}
        />
        <div className="d-flex flex-column ms-3">
          <h5 className="text-white">{username}</h5>
          <div className="d-flex">
            <p className="me-2 text-muted">Share with: </p>
            <select
              id="select"
              className="form-select form-select-sm"
              value={privacy}
              onChange={handleSelectChange}
              style={{
                background: "#333",
                color: "white",
                width: "100px",
                height: "25px",
                fontSize: "12px",
              }}
            >
              <option value="public">Public</option>
              <option value="friends">Friends</option>
              <option value="me">Only Me</option>
            </select>
          </div>
        </div>
      </div>
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
        <MDBBtn color="warning" outline onClick={createPost} id="button-addon2">
          Post
        </MDBBtn>
      </MDBInputGroup>
    </>
  );
}
