import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Profile from "../components/Profile";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import Messages from "../components/Messages";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  MDBRow,
  MDBCol,
  MDBContainer,
  MDBInput,
  MDBBtn,
  MDBCard,
  MDBCardBody,
} from "mdb-react-ui-kit";
import moment from "moment";
import avatar from "../files/avatar.png";

function MessageDetails() {
  const [message, setMessage] = useState("");
  const isAlreadyLogged = localStorage.getItem("userId");
  const [listOfPost, setListOfPost] = useState([]);
  const [effect, setEffect] = useState(1);
  const [user, setUser] = useState({});
  const [page, setPage] = useState(1);
  const imageLink = "http://localhost:8000/public/";
  const [hasMore, setHasMore] = useState(true);

  let { userId } = useParams();

  useEffect(() => {
    async function getData() {
      let response = await axios.get(
        `http://localhost:8000/messages/${userId}/${page}`,
        {
          headers: {
            userId: isAlreadyLogged,
          },
        }
      );
      setUser(response.data.data.user);
      setListOfPost(listOfPost.concat(response.data.data.messages));
      if (response.data.data.messages.length !== 10) {
        setHasMore(false);
      }
    }
    getData();
  }, [page, effect]);

  const loadMore = () => {
    setPage(page + 1);
  };

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let response = await axios.post(
      `http://localhost:8000/messages/send`,
      {
        to: user.id,
        message,
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
    setEffect(1 - effect);
    setHasMore(true);
  };

  return (
    <Container>
      {!isAlreadyLogged && <Navigate to="/login" />}
      <Row
        className="justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Col sm="10" className="level1 p-0">
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
                <MDBContainer className="mt-5">
                  <MDBRow>
                    <MDBCol md="12">
                      <MDBCard className="border-light mb-3">
                        <MDBCardBody>
                          <MDBRow>
                            <MDBCol md="2">
                              <img
                                src={
                                  !user.dp || user.dp === ""
                                    ? avatar
                                    : imageLink + user.dp
                                }
                                className="img-thumbnail"
                                width="50px"
                              />
                            </MDBCol>
                            <MDBCol md="10">
                              <h4>{user.name}</h4>
                            </MDBCol>
                          </MDBRow>
                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>
                  </MDBRow>
                  {hasMore && (
                    <MDBRow className="text-center">
                      <MDBCol md="12">
                        <MDBBtn outline color="warning mb-3" onClick={loadMore}>
                          Load More
                        </MDBBtn>
                      </MDBCol>
                    </MDBRow>
                  )}
                  {listOfPost
                    .slice()
                    .reverse()
                    .map((message) => (
                      <MDBRow key={message._id} className="mb-3 level2">
                        {message.from !== isAlreadyLogged ? (
                          <MDBCol
                            md="2"
                            className="d-flex justify-content-center align-items-center"
                          >
                            <img
                              src={
                                !user.dp || user.dp === ""
                                  ? avatar
                                  : imageLink + user.dp
                              }
                              className="img-thumbnail"
                              width="50px"
                            />
                          </MDBCol>
                        ) : (
                          <MDBCol md="2"></MDBCol>
                        )}
                        <MDBCol md="8">
                          <MDBCard
                            className={
                              message.from === isAlreadyLogged
                                ? "border-primary"
                                : "border-secondary"
                            }
                          >
                            <MDBCardBody className="level3">
                              <p className="text-white">{message.message}</p>
                              <small className="text-muted">
                                {moment(message.createdAt).format(
                                  "MMM DD, YYYY h:mm A"
                                )}
                              </small>
                            </MDBCardBody>
                          </MDBCard>
                        </MDBCol>
                        {/* {message.from === isAlreadyLogged ? (
                          <MDBCol
                            md="2"
                            className="d-flex justify-content-center align-items-center"
                          >
                            <img
                              src={
                                !user.dp || user.dp === ""
                                  ? avatar
                                  : imageLink + user.dp
                              }
                              className="img-thumbnail"
                              width="50px"
                            />
                          </MDBCol>
                        ) : (
                          <></>
                        )} */}
                      </MDBRow>
                    ))}

                  <MDBRow>
                    <MDBCol md="12">
                      <form onSubmit={handleSubmit}>
                        <MDBInput
                          type="text"
                          value={message}
                          onChange={handleInputChange}
                          label="Type your message"
                          required
                        />
                        <MDBBtn color="primary" type="submit">
                          Send
                        </MDBBtn>
                      </form>
                    </MDBCol>
                  </MDBRow>
                </MDBContainer>
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
