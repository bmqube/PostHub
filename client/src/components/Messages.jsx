import React, { useEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";
import { Badge, Button, PageHeader, Image } from "react-bootstrap";
import avatar from "../files/avatar.png";

export default function Messages() {
  const isAlreadyLogged = localStorage.getItem("userId");
  const [listOfUsers, setListOfUsers] = useState([]);
  const [effect, setEffect] = useState(false);
  const imageLink = "http://localhost:8000/public/";

  useEffect(() => {
    async function getData() {
      let response = await axios.get("http://localhost:8000/messages/", {
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
      <h3 className="text-white">Messages</h3>
      {listOfUsers.length === 0 ? (
        <p className="text-white">
          You don't have any messages. Don't you have any friends?
        </p>
      ) : (
        <ListGroup className="my-3">
          {listOfUsers.map((e, index) => (
            <a href={`/message/${e.user}`}>
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
                    <div className="fw-bold text-white">{e.username}</div>
                    <div className="text-muted">{e.message}</div>
                  </div>
                </div>
              </ListGroup.Item>
            </a>
          ))}
        </ListGroup>
      )}
    </div>
  );
}
