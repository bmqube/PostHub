import React, { useEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";
import { Badge, Button, PageHeader, Image, Modal, Form } from "react-bootstrap";
import avatar from "../files/avatar.png";
const CryptoJS = require("crypto-js");

export default function Messages() {
  const isAlreadyLogged = localStorage.getItem("userId");
  const [listOfUsers, setListOfUsers] = useState([]);
  const [effect, setEffect] = useState(false);
  const [gcName, setGcName] = useState("");
  const imageLink = "http://localhost:8000/public/";

  const [data, setData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleNewGC = async (e) => {
    e.preventDefault();

    if (gcName && selectedItems.length > 0) {
      const data = {
        gcName: gcName,
        selectedItems: selectedItems,
      };

      let response = await axios.post(
        "http://localhost:8000/messages/gc/create",
        data,
        {
          headers: {
            userId: isAlreadyLogged,
          },
        }
      );

      console.log(response);

      if (response.data.code === "SUCCESS") {
        setEffect(!effect);
        handleClose();
      }
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    if (inputValue) {
      fetchData();
    }
  }, [inputValue]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/messages/gc/" + inputValue,
        {
          headers: {
            userId: isAlreadyLogged,
          },
        }
      );
      const filteredList = response.data.data.filter(
        (item) => !selectedItems.includes(item)
      );
      setData(filteredList);
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // const handleSelect = (item) => {
  //   // console.log(item);
  //   setSelectedItems([...selectedItems, data[item]]);
  // };

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
      {/* <div className="d-flex justify-content-between"> */}
      <h3 className="text-white">Messages</h3>
      {/* <Button
          className="text-white"
          variant="outline-warning"
          size="sm"
          onClick={handleShow}
        >
          New Group Chat
        </Button>
      </div> */}
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
                    <div className="text-muted">
                      {CryptoJS.AES.decrypt(e.message, e.user).toString(
                        CryptoJS.enc.Utf8
                      ) ||
                        CryptoJS.AES.decrypt(
                          e.message,
                          isAlreadyLogged
                        ).toString(CryptoJS.enc.Utf8)}
                    </div>
                  </div>
                </div>
              </ListGroup.Item>
            </a>
          ))}
        </ListGroup>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Group Chat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formInput">
            <Form.Control
              type="text"
              placeholder="Group Chat Name"
              value={gcName}
              onChange={(e) => setGcName(e.target.value)}
            />
            <Form.Label>Search for your friends: </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter a query"
              value={inputValue}
              onChange={handleInputChange}
            />
          </Form.Group>
          {inputValue &&
            (data.length > 0 ? (
              <>
                <p>Search Results: </p>
                <ListGroup>
                  {data.map((item) => (
                    <ListGroup.Item key={item.userId}>
                      <div className="d-flex">
                        <p className="mb-0">{item.name}</p>
                        <Badge
                          onClick={() => {
                            if (
                              item &&
                              !selectedItems.some(
                                (e) => e.userId === item.userId
                              )
                            ) {
                              setSelectedItems([...selectedItems, item]);
                            }
                          }}
                          bg="warning ms-2"
                        >
                          Select
                        </Badge>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </>
            ) : (
              <p>Your query has zero results.</p>
            ))}
          {selectedItems.length > 0 ? (
            <>
              <p>Selected</p>
              <ListGroup>
                {selectedItems.map((item) => (
                  <ListGroup.Item key={item.userId}>
                    <div className="d-flex">
                      <p className="mb-0">{item.name}</p>
                      {/* <Badge
                        onClick={() => {
                          handleSelect(i);
                        }}
                        bg="warning ms-2"
                      >
                        Select
                      </Badge> */}
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          ) : (
            <></>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="warning" onClick={handleNewGC}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
