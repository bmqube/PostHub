import React, { useEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";
import { Badge, Button, PageHeader } from "react-bootstrap";

export default function FriendRequests() {
  const isAlreadyLogged = localStorage.getItem("userId");
  const [listOfUsers, setListOfUsers] = useState([]);
  const [effect, setEffect] = useState(false);

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
    <div className="mb-3">
      <h3 className="text-white">Friend Requests</h3>
      {listOfUsers.length === 0 ? (
        <p className="text-white">No Friend Requests</p>
      ) : (
        <ListGroup className="my-3 bg-dark">
          {listOfUsers.map((e, index) => (
            <ListGroup.Item
              as="li"
              key={index}
              className="d-flex justify-content-between align-items-start"
            >
              <div className="ms-2 me-auto">
                <div className="fw-bold">{e.name}</div>
                <div className="text-muted">Still Working</div>
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
