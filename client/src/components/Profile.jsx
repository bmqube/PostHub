import React, { useEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";
import { Badge, Button } from "react-bootstrap";

export default function Profile() {
  const isAlreadyLogged = localStorage.getItem("userId");
  const [profileDetails, setProfileDetails] = useState({
    name: "",
  });

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
      setProfileDetails(response.data.data);
    }
    getData();
  }, []);

  return (
    <div className="text-white mb-3">Logged in as {profileDetails.name}</div>
  );
}
