import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Header from "../components/Header";
import { useState, useEffect, useRef } from "react";
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
import SinglePost from "../components/SinglePost";

function PostDetails() {
  const [post, setPost] = useState({});
  const [listOfComment, setListOfComment] = useState([]);
  const isAlreadyLogged = localStorage.getItem("userId");
  const imageLink = "http://localhost:8000/public/";
  const [comment, setComment] = useState("");
  const inputRef = useRef(null);
  const [bottom, setBottom] = useState(false);

  const handleClick = () => {
    inputRef.current.click();
  };

  let { postId } = useParams();

  const goToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  //   const socket = io("http://localhost:8000");
  //   socket.on("connect", () => {
  //     socket.emit("setRoom", isAlreadyLogged);
  //     socket.on("message", (e) => {
  //       let data = [];
  //       data.push(e);
  //       console.log(e);
  //       setListOfPost(data.concat(listOfPost));
  //       goToBottom();
  //     });
  //   });

  const getData = async () => {
    let response = await axios.get(
      `http://localhost:8000/post/details/${postId}`,
      {
        headers: {
          userId: isAlreadyLogged,
        },
      }
    );
    setPost(response.data.data.post);
    setListOfComment(response.data.data.comments);
    console.log(response.data.data.comments);
    // if (response.data.data.messages.length !== 10) {
    //   setHasMore(false);
    // } else {
    //   setHasMore(true);
    // }
    // if (page === 1) {
    //   setHasNewer(false);
    // } else {
    //   setHasNewer(true);
    // }
  };

  useEffect(() => {
    goToBottom();
  }, [listOfComment]);

  useEffect(() => {
    getData();
  }, [bottom]);

  //   const loadMore = () => {
  //     setPage(page + 1);
  //   };

  //   const loadNewer = () => {
  //     setPage(page - 1);
  //   };

  const handleInputChange = (event) => {
    event.preventDefault();
    setComment(event.target.value);
  };

  const handleSubmit = async (event) => {
    // console.log("hd");
    event.preventDefault();
    if (comment) {
      let response = await axios.post(
        `http://localhost:8000/post/comment`,
        {
          postId: postId,
          comment: comment,
        },
        {
          headers: {
            userId: isAlreadyLogged,
          },
        }
      );
      //   console.log(response.data);
      setComment("");
      setBottom(!bottom);
    }
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
                <Sidebar link="Home" />
              </Col>
              <Col sm={12} lg={9}>
                <Container>
                  <SinglePost post={post} />
                  {listOfComment.map((comment) => (
                    <div
                      key={comment._id}
                      className="d-flex level2 mb-2 rounded-3"
                    >
                      {/* <Row key={comment._id} className="mb-3"> */}
                      <div style={{ maxWidth: "4rem" }} className="me-3">
                        <img
                          src={
                            !comment.dp || comment.dp === ""
                              ? avatar
                              : imageLink + comment.dp
                          }
                          className="img-thumbnail m-3 rounded-circle"
                        />
                      </div>
                      <div className="ms-3 mt-3">
                        <a href={`/profile/${comment.creator}`}>
                          {comment.creatorName}
                        </a>
                        {/* <div className={`d-flex justify-content-start`}> */}
                        <OverlayTrigger
                          placement="right"
                          overlay={
                            <Tooltip id="tooltip">
                              {" "}
                              {moment(comment.createdAt).format(
                                "MMM DD, YYYY h:mm A"
                              )}
                            </Tooltip>
                          }
                        >
                          <p
                            className={`text-white mb-0`}
                            style={{
                              maxWidth: "100%",
                              overflowWrap: "break-word",
                            }}
                          >
                            {comment.message}
                          </p>
                        </OverlayTrigger>
                        {/* </div> */}
                      </div>
                      {/* </Row> */}
                    </div>
                    // setBottom(!bottom)
                  ))}
                  {/* {hasNewer && (
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
                  )} */}
                  <form onSubmit={handleSubmit}>
                    <InputGroup className="mb-3">
                      <Form.Control
                        type="text"
                        className="me-2"
                        value={comment}
                        onChange={handleInputChange}
                      />
                      <Button variant="warning" type="submit">
                        Comment
                      </Button>
                    </InputGroup>
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

export default PostDetails;
