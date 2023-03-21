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

export default function Profile({ effect, setEffect }) {
  const [listOfPost, setListOfPost] = useState([]);
  const [profileDetails, setProfileDetails] = useState({});
  const isAlreadyLogged = localStorage.getItem("userId");
  const [basicModal, setBasicModal] = useState(false);
  const [dp, setDp] = useState(null);

  const toggleShow = () => setBasicModal(!basicModal);

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
      setBasicModal(!basicModal);
    }
  };

  let { userId } = useParams();

  // console.log(userId);

  useEffect(() => {
    async function getData() {
      let response = await axios.get("http://localhost:8000/post/feed/mine", {
        headers: {
          userId: isAlreadyLogged,
        },
      });
      // console.log(response.data);
      setListOfPost(response.data.data);

      let link = "http://localhost:8000/profile/";

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
        <MDBCol onClick={toggleShow} className="mb-4">
          <img
            src={avatar}
            className="border border-3 border-warning rounded-circle"
            alt=""
            width={200}
            height={200}
          />
        </MDBCol>
      </div>
      <CreatePost effect={effect} setEffect={setEffect} />
      <div className="text-white mb-3">
        {listOfPost.length === 0 ? (
          <p className="text-white text-center">
            You have not made a post yet. Post now?
          </p>
        ) : (
          listOfPost.map((e, index) => (
            <SinglePost key={index} post={e} user="Self" />
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
    </>
  );
}
