import React, { useEffect, useState } from "react";
import SinglePost from "./SinglePost";
import axios from "axios";
import {
  MDBCol,
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBFile,
} from "mdb-react-ui-kit";
import CreatePost from "./CreatePost";
import avatar from "../files/avatar.png";
import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function Profile({ effect, setEffect }) {
  const [listOfPost, setListOfPost] = useState([]);
  const [profileDetails, setProfileDetails] = useState({});
  const isAlreadyLogged = localStorage.getItem("userId");
  const [basicModal, setBasicModal] = useState(false);
  const [dp, setDp] = useState(null);
  const [unfriendModal, setUnfriendModal] = useState(false);

  let { userId } = useParams();

  const toggleShow = () => {
    if (!userId) {
      setBasicModal(!basicModal);
    }
  };

  const selectFile = (e) => setDp(e.target.files[0]);

  const handleDPUpload = async () => {
    if (dp) {
      let body = new FormData();
      body.append("dp", dp);
      let response = await axios.post(
        "http://localhost:8000/profile/update/dp",
        body,
        {
          headers: {
            userId: isAlreadyLogged,
          },
        }
      );
      // console.log(response.data);
      setDp(null);
      setBasicModal(!basicModal);
      setEffect(!effect);
    }
  };

  // console.log(userId);

  const sendFriendReq = async (e) => {
    e.preventDefault();
    let response = await axios.post(
      "http://localhost:8000/connect/send/" + userId,
      {},
      {
        headers: {
          userId: isAlreadyLogged,
        },
      }
    );

    console.log(response);

    setEffect(!effect);
  };

  const cancelFriendReq = async (e) => {
    e.preventDefault();
    let response = await axios.post(
      "http://localhost:8000/connect/cancel/" + userId,
      {},
      {
        headers: {
          userId: isAlreadyLogged,
        },
      }
    );

    console.log(response);

    setEffect(!effect);
  };

  const unfriendUser = async (e) => {
    e.preventDefault();
    let response = await axios.post(
      "http://localhost:8000/connect/unfriend/" + userId,
      {},
      {
        headers: {
          userId: isAlreadyLogged,
        },
      }
    );

    console.log(response);

    setUnfriendModal(!unfriendModal);

    setEffect(!effect);
  };

  const acceptFriendReq = async (e) => {
    e.preventDefault();
    let response = await axios.get(
      "http://localhost:8000/connect/accept/" + userId,
      {
        headers: {
          userId: isAlreadyLogged,
        },
      }
    );

    // console.log(response);

    setEffect(!effect);
  };

  useEffect(() => {
    async function getData() {
      let link = "http://localhost:8000/post/feed/";
      if (userId) {
        link = link + userId;
      } else {
        link = link + "mine";
      }

      let response = await axios.get(link, {
        headers: {
          userId: isAlreadyLogged,
        },
      });
      // console.log(response.data);
      setListOfPost(response.data.data);

      link = "http://localhost:8000/profile/";

      if (userId) {
        link = link + userId;
      } else {
        link = link + "my";
      }

      response = await axios.get(link, {
        headers: {
          userId: isAlreadyLogged,
        },
      });
      // console.log(response.data);
      if (response.data.code === "SUCCESS") {
        // console.log(response.data.data);
        setProfileDetails(response.data.data);
      }
    }
    getData();
  }, [effect]);

  return (
    <>
      <div className="text-center">
        <MDBCol className="mb-4">
          {profileDetails.dp === undefined || profileDetails.dp === "" ? (
            <img
              src={avatar}
              className="border border-3 border-warning rounded-circle"
              alt=""
              width={200}
              height={200}
            />
          ) : (
            <img
              src={`http://localhost:8000/public/${profileDetails.dp}`}
              className="border border-3 border-warning rounded-circle"
              alt=""
              width={200}
              height={200}
            />
          )}
        </MDBCol>
        <p class="fw-bold text-white fs-3">{profileDetails.name}</p>
        <p class="text-muted">{"Just Another Random Guy"}</p>
      </div>
      <div className="row justify-content-center mb-3">
        <div className="col-md-4 col-6">
          <div className="d-grid">
            {userId &&
              (!profileDetails.status ||
                profileDetails.status === "rejected") && (
                <Button
                  onClick={sendFriendReq}
                  variant="outline-secondary text-white"
                >
                  <i class="fa-solid fa-user-plus"></i> Add Friend
                </Button>
              )}

            {userId &&
              profileDetails.status &&
              profileDetails.status === "accepted" && (
                <Button
                  onClick={() => {
                    setUnfriendModal(!unfriendModal);
                  }}
                  variant="outline-secondary text-white"
                >
                  <i class="fa-solid fa-user-check"></i> Friends
                </Button>
              )}

            {userId &&
              profileDetails.status &&
              profileDetails.status === "pending" && (
                <Button
                  onClick={cancelFriendReq}
                  variant="outline-secondary text-white"
                >
                  <i class="fa-solid fa-user-xmark"></i> Cancel
                </Button>
              )}

            {userId &&
              profileDetails.status &&
              profileDetails.status === "confirm" && (
                <Button
                  onClick={acceptFriendReq}
                  variant="outline-secondary text-white"
                >
                  <i class="fa-solid fa-user-xmark"></i> Confirm
                </Button>
              )}

            {!userId && (
              <Button
                onClick={sendFriendReq}
                variant="outline-secondary text-white"
              >
                <i class="fa-solid fa-pen-to-square"></i> Edit
              </Button>
            )}
          </div>
        </div>
        <div className="col-md-4 col-6">
          <div className="d-grid">
            {userId && (
              <Button href={`/message/${userId}`} variant="outline-warning">
                <i class="fa-regular fa-message"></i> Message
              </Button>
            )}
            {!userId && (
              <Button onClick={toggleShow} variant="outline-warning">
                <i class="fa-solid fa-image"></i> Update DP
              </Button>
            )}
          </div>
        </div>
      </div>
      {!userId && <CreatePost effect={effect} setEffect={setEffect} />}
      <div className="text-white mb-3">
        {listOfPost.length === 0 ? (
          <p className="text-white text-center">
            You have not made a post yet. Post now?
          </p>
        ) : (
          listOfPost.map((e, index) => (
            <SinglePost
              key={index}
              post={e}
              effect={effect}
              setEffect={setEffect}
            />
          ))
        )}
      </div>

      <MDBModal show={basicModal} setShow={setBasicModal} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Update Profile Profile</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBFile
                onChange={selectFile}
                color="warning"
                label="Choose an image"
                id="dp"
                accept="image/png, image/jpeg"
              />
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color="light" onClick={toggleShow}>
                Close
              </MDBBtn>
              <MDBBtn color="warning" onClick={handleDPUpload}>
                Update
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      <MDBModal show={unfriendModal} setShow={setUnfriendModal} tabIndex="1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Unfriend</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={() => {
                  setUnfriendModal(!unfriendModal);
                }}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              Are you sure you want to unfriend{" "}
              <strong>{profileDetails.name}</strong>?
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn
                color="success"
                onClick={() => {
                  setUnfriendModal(!unfriendModal);
                }}
              >
                Close
              </MDBBtn>
              <MDBBtn color="danger" onClick={unfriendUser}>
                Unfriend
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}
