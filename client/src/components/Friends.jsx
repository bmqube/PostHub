import React, { useEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";
import { Badge, Button, PageHeader, Image } from "react-bootstrap";
import avatar from "../files/avatar.png";

export default function Friends() {
  const isAlreadyLogged = localStorage.getItem("userId");
  const [listOfUsers, setListOfUsers] = useState([]);
  const [effect, setEffect] = useState(false);
  const imageLink = "http://localhost:8000/public/";

  useEffect(() => {
    async function getData() {
      let response = await axios.get("http://localhost:8000/profile/friends", {
        headers: {
          userId: isAlreadyLogged,
        },
      });
      // console.log(response.data);
      setListOfUsers(response.data.data);
    }
    getData();
  }, [effect]);

  return (
    <div className="mb-3">
      <h3 className="text-white">Friends</h3>
      {listOfUsers.length === 0 ? (
        <p className="text-white">
          You don't have any friends. Go out and make some.
        </p>
      ) : (
        <ListGroup className="my-3 bg-dark">
          {listOfUsers.map((e, index) => (
            <ListGroup.Item
              as="li"
              key={index}
              className="d-flex justify-content-between align-items-start"
            >
              <div className="d-flex ms-2">
                <img
                  src={!e.dp || e.dp === "" ? avatar : imageLink + e.dp}
                  className="img-thumbnail"
                  width="50px"
                />
                <div className="ms-3">
                  <div className="fw-bold">{e.name}</div>
                  <div className="text-muted">{e.email}</div>
                </div>
              </div>
              <a href={`/profile/${e.userId}`} class="btn btn-warning">
                View Profile
              </a>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}
