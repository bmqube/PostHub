import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Header from "../components/Header";
import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
import { Navigate, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { MDBInput, MDBBtn, MDBCard, MDBCardBody } from "mdb-react-ui-kit";
import moment from "moment";
import avatar from "../files/avatar.png";
import { io } from "socket.io-client";
import {
  Tooltip,
  OverlayTrigger,
  Button,
  Form,
  InputGroup,
} from "react-bootstrap";

function NotificationPage() {
  const isAlreadyLogged = localStorage.getItem("userId");
  const [listOfNotification, setListOfNotification] = useState([]);
  const [flag, setFlag] = useState(true);
  const imageLink = "http://localhost:8000/public/";

  function formatTime(postDate) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let now = new Date();
    postDate = new Date(postDate);
    const diff = Math.abs(now - postDate);
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;
    const year = 365 * day;

    if (diff < minute) {
      return "Just now";
    } else if (diff < hour) {
      return Math.floor(diff / minute) + " minutes ago";
    } else if (diff < day) {
      return Math.floor(diff / hour) + " hours ago";
    } else if (diff < week) {
      return Math.floor(diff / day) + " days ago";
    } else if (diff < month) {
      return Math.floor(diff / week) + " weeks ago";
    } else {
      const hour = (postDate.getHours() % 12).toString().padStart(2, "0");
      const minute = postDate.getMinutes().toString().padStart(2, "0");
      const ampm = postDate.getHours() >= 12 ? "PM" : "AM";
      return `${
        monthNames[postDate.getMonth()]
      } ${postDate.getDate()} at ${hour}:${minute} ${ampm}`;
    }
  }

  const socket = io("http://localhost:8000");
  socket.on("connect", () => {
    socket.emit("setRoom", isAlreadyLogged);
    socket.on("notification", (e) => {
      setFlag(!flag);
    });
  });

  const getData = async () => {
    let response = await axios.get(`http://localhost:8000/notification/`, {
      headers: {
        userId: isAlreadyLogged,
      },
    });

    setListOfNotification(response.data.data);
    console.log(response.data.data);
  };

  useEffect(() => {
    getData();
  }, [flag]);

  // const loadMore = () => {
  //   setPage(page + 1);
  // };

  // const loadNewer = () => {
  //   setPage(page - 1);
  // };

  return (
    <Container sm>
      {!isAlreadyLogged && <Navigate to="/login" />}
      <Row
        className="justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Col md="10" className="level1 p-0">
          <Header />
          <div
            style={{ minHeight: "100vh" }}
            className="consistent-height px-5"
          >
            <Row className="mt-4">
              <Col sm={12} lg={3}>
                <Sidebar link="Notifications" />
              </Col>
              <Col sm={12} lg={9}>
                {listOfNotification
                  .slice()
                  .reverse()
                  .map((item) => {
                    return (
                      <a className="text-white" href={`/post/${item.post}`}>
                        <div className="d-flex align-items-center border border-dark mb-2">
                          <div style={{ maxWidth: "3rem" }} className="me-3">
                            <img
                              src={
                                !item.causedBy.dp || item.causedBy.dp === ""
                                  ? avatar
                                  : imageLink + item.causedBy.dp
                              }
                              className="img-thumbnail m-3 rounded-circle"
                            />
                          </div>
                          <div className="ms-3">
                            <div>
                              {item.causedBy.name}{" "}
                              {item.notifyFor === "reaction"
                                ? "reacted"
                                : "commented"}
                              {" on your post"}
                            </div>
                            <div className="text-muted">
                              {formatTime(item.createdAt)}
                            </div>
                          </div>
                        </div>
                      </a>
                    );
                  })}
              </Col>
            </Row>
          </div>
          <Footer />
        </Col>
      </Row>
    </Container>
  );
}

export default NotificationPage;
