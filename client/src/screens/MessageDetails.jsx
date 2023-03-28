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

function MessageDetails() {
  const [message, setMessage] = useState("");
  const isAlreadyLogged = localStorage.getItem("userId");
  const [listOfPost, setListOfPost] = useState([]);
  const [reload, setReload] = useState(1);
  const [user, setUser] = useState({});
  const [page, setPage] = useState(1);
  const imageLink = "http://localhost:8000/public/";
  const [hasMore, setHasMore] = useState(true);
  const [hasNewer, setHasNewer] = useState(false);
  const messagesContainerRef = useRef(null);

  let { userId } = useParams();

  const goToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  const socket = io("http://localhost:8000");
  socket.on("connect", () => {
    socket.emit("setRoom", isAlreadyLogged);
    socket.on("message", (e) => {
      let data = [];
      data.push(e);
      console.log(e);
      setListOfPost(data.concat(listOfPost));
      goToBottom();
    });
  });

  const getData = async () => {
    let response = await axios.get(
      `http://localhost:8000/messages/${userId}/${page}`,
      {
        headers: {
          userId: isAlreadyLogged,
        },
      }
    );
    setUser(response.data.data.user);
    setListOfPost(response.data.data.messages);
    if (response.data.data.messages.length !== 10) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
    if (page === 1) {
      setHasNewer(false);
    } else {
      setHasNewer(true);
    }
  };

  useEffect(() => {
    goToBottom();
  }, [listOfPost]);

  useEffect(() => {
    getData();
  }, [page, reload]);

  const loadMore = () => {
    setPage(page + 1);
  };

  const loadNewer = () => {
    setPage(page - 1);
  };

  const handleInputChange = (event) => {
    event.preventDefault();
    console.log(event.target.value);
    setMessage(event.target.value);
  };

  const handleSubmit = async (event) => {
    // console.log("hd");
    event.preventDefault();
    let response = await axios.post(
      `http://localhost:8000/messages/send`,
      {
        to: user.id,
        message: message,
      },
      {
        headers: {
          userId: isAlreadyLogged,
        },
      }
    );
    setMessage("");
    setListOfPost([]);
    setPage(1);
    setReload(1 - reload);
    setHasMore(true);
  };

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
                <Sidebar link="Messages" />
              </Col>
              <Col sm={12} lg={9}>
                <Container className="mt-5">
                  <Row>
                    <Col xs="12">
                      <MDBCard className="border-light mb-3">
                        <MDBCardBody>
                          <Row>
                            <Col xs="2">
                              <img
                                src={
                                  !user.dp || user.dp === ""
                                    ? avatar
                                    : imageLink + user.dp
                                }
                                className="img-thumbnail"
                                width="50px"
                              />
                            </Col>
                            <Col xs="10">
                              <h4>{user.name}</h4>
                            </Col>
                          </Row>
                        </MDBCardBody>
                      </MDBCard>
                    </Col>
                  </Row>
                  {hasMore && (
                    <Row className="text-center">
                      <Col xs="12">
                        <MDBBtn outline color="warning mb-3" onClick={loadMore}>
                          Load Older
                        </MDBBtn>
                      </Col>
                    </Row>
                  )}
                  {listOfPost
                    .slice()
                    .reverse()
                    .map((message) => (
                      <Row key={message._id} className="mb-3">
                        {message.from !== isAlreadyLogged ? (
                          <Col
                            xs="4"
                            sm="2"
                            className="d-flex justify-content-center align-items-end"
                          >
                            <img
                              src={
                                !user.dp || user.dp === ""
                                  ? avatar
                                  : imageLink + user.dp
                              }
                              className="img-thumbnail mb-3"
                              width="50px"
                            />
                          </Col>
                        ) : (
                          <Col xs="4"></Col>
                        )}
                        <Col xs="8">
                          <div
                            className={`d-flex level1 justify-content-${
                              message.from === isAlreadyLogged ? "end" : "start"
                            }`}
                          >
                            <OverlayTrigger
                              placement={`${
                                message.from === isAlreadyLogged
                                  ? "left"
                                  : "right"
                              }`}
                              overlay={
                                <Tooltip id="tooltip">
                                  {" "}
                                  {moment(message.createdAt).format(
                                    "MMM DD, YYYY h:mm A"
                                  )}
                                </Tooltip>
                              }
                            >
                              <p
                                style={{
                                  maxWidth: "100%",
                                  overflowWrap: "break-word",
                                }}
                                className={`text-white p-3 rounded-5 ${
                                  message.from === isAlreadyLogged
                                    ? "bg-warning"
                                    : "level3"
                                }`}
                              >
                                {message.type === "message" && message.message}
                              </p>
                            </OverlayTrigger>

                            {/* <small className="text-muted">
                                  {moment(message.createdAt).format(
                                    "MMM DD, YYYY h:mm A"
                                  )}
                                </small> */}
                          </div>
                        </Col>
                      </Row>
                    ))}
                  {hasNewer && (
                    <Row className="text-center">
                      <Col xs="12">
                        <MDBBtn
                          outline
                          color="warning mb-3"
                          onClick={loadNewer}
                        >
                          Load Newer
                        </MDBBtn>
                      </Col>
                    </Row>
                  )}
                  <form onSubmit={handleSubmit}>
                    {/* <Form.Group
                      as={Row}
                      className="mb-3"
                      controlId="formPlaintextEmail"
                    >
                      <Form.Label column xs="2">
                        <Button>
                          <i class="fa-solid fa-paperclip"></i>
                        </Button>
                      </Form.Label>
                      <Col xs="10">
                        <Form.Control
                          type="text"
                          defaultValue="email@example.com"
                          value={message}
                          onChange={handleInputChange}
                          required
                        />
                      </Col>
                    </Form.Group> */}

                    <InputGroup className="mb-3">
                      <Button variant="outline-warning" className="me-2">
                        <i class="fa-solid fa-paperclip"></i>
                      </Button>
                      <Form.Control
                        type="text"
                        className="me-2"
                        value={message}
                        onChange={handleInputChange}
                        required
                      />
                      <Button variant="warning" type="submit">
                        Send
                      </Button>
                    </InputGroup>

                    {/* <Row>
                      <Col sm={2} xs={2}>
                        <MDBBtn outline color="warning" type="submit">
                          <i class="fa-solid fa-paperclip"></i>
                        </MDBBtn>
                      </Col>
                      <Col sm={8} xs={8}>
                        <MDBInput
                          type="text"
                          value={message}
                          onChange={handleInputChange}
                          label="Type your message"
                          required
                        />
                      </Col>
                      <Col sm={2} xs={2}>
                        <MDBBtn color="warning" type="submit">
                          Send
                        </MDBBtn>
                      </Col>
                    </Row> */}
                  </form>
                </Container>
              </Col>
            </Row>
          </div>
          <Footer />
        </Col>
      </Row>
    </Container>
  );
}

export default MessageDetails;
