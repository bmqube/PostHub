import React, { useEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";
import { Badge, Button, PageHeader, Image } from "react-bootstrap";
import avatar from "../files/avatar.png";

export default function FriendRequests() {
  const isAlreadyLogged = localStorage.getItem("userId");
  const [listOfUsers, setListOfUsers] = useState([]);
  const [effect, setEffect] = useState(false);
  const imageLink = "http://localhost:8000/public/";

  useEffect(() => {
    async function getData() {
      let response = await axios.get("http://localhost:8000/connect/requests", {
        headers: {
          userId: isAlreadyLogged,
        },
      });
      // console.log(response.data);
      setListOfUsers(response.data.data);
    }
    getData();
  }, [effect]);

  const acceptFriendReq = async (receiver) => {
    // e.preventDefault();
    let response = await axios.get(
      "http://localhost:8000/connect/accept/" + receiver,
      {
        headers: {
          userId: isAlreadyLogged,
        },
      }
    );

    console.log(response);

    setEffect(!effect);
  };

  return (
    <div className="mb-5">
      <h3 className="text-white">Friend Requests</h3>
      {listOfUsers.length === 0 ? (
        <p className="text-white">No Friend Requests</p>
      ) : (
        <ListGroup className="my-3 bg-dark">
          {listOfUsers.map((e, index) => (
            <ListGroup.Item
              as="li"
              key={index}
              className="d-flex justify-content-between align-items-start level2"
            >
              <div className="d-flex ms-2">
                <img
                  src={!e.dp || e.dp === "" ? avatar : imageLink + e.dp}
                  className="img-thumbnail"
                  width="50px"
                />
                <div className="ms-3">
                  <a href={`/profile/${e.userId}`}>
                    <div className="fw-bold text-white">{e.name}</div>
                  </a>
                  <div className="text-muted">{e.email}</div>
                </div>
              </div>
              <Button
                onClick={() => {
                  acceptFriendReq(e.userId);
                }}
                variant="warning"
              >
                Accept
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}
