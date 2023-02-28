import React, { useEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";
import { Badge, Button } from "react-bootstrap";

export default function Suggestions() {
  const isAlreadyLogged = localStorage.getItem("userId");
  const [listOfUsers, setListOfUsers] = useState([]);
  const [effect, setEffect] = useState(false);

  useEffect(() => {
    async function getData() {
      let response = await axios.get(
        "http://localhost:8000/connect/suggestions",
        {
          headers: {
            userId: isAlreadyLogged,
          },
        }
      );
      setListOfUsers(response.data.data);
    }
    getData();
  }, [effect]);

  const sendFriendReq = async (receiver) => {
    // e.preventDefault();
    let response = await axios.post(
      "http://localhost:8000/connect/send/" + receiver,
      {},
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
    <div className="mb-3">
      <h3 className="text-white">Suggestions</h3>
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
                  sendFriendReq(e.userId);
                }}
                variant="warning"
              >
                Add
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}
