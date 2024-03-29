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
import { AES } from "crypto-js";
const CryptoJS = require("crypto-js");

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
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);
  const [bottom, setBottom] = useState(false);
  const [decryptedFile, setDecryptedFile] = useState(null);

  const handleClick = () => {
    inputRef.current.click();
  };

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
    // console.log(event.target.value);
    setMessage(event.target.value);
  };

  const handleFileUpload = (event) => {
    event.preventDefault();
    // console.log(event.target.files[0]);
    setFile(event.target.files[0]);
  };

  function convertWordArrayToUint8Array(wordArray) {
    var arrayOfWords = wordArray.hasOwnProperty("words") ? wordArray.words : [];
    var length = wordArray.hasOwnProperty("sigBytes")
      ? wordArray.sigBytes
      : arrayOfWords.length * 4;
    var uInt8Array = new Uint8Array(length),
      index = 0,
      word,
      i;
    for (i = 0; i < length; i++) {
      word = arrayOfWords[i];
      uInt8Array[index++] = word >> 24;
      uInt8Array[index++] = (word >> 16) & 0xff;
      uInt8Array[index++] = (word >> 8) & 0xff;
      uInt8Array[index++] = word & 0xff;
    }
    return uInt8Array;
  }

  const handleSubmit = async (event) => {
    // console.log("hd");
    event.preventDefault();
    if (message) {
      let encryptedText = AES.encrypt(message, isAlreadyLogged).toString();
      let response = await axios.post(
        `http://localhost:8000/messages/send`,
        {
          to: user.id,
          message: encryptedText,
          type: "message",
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
    }

    if (file) {
      // console.log("ddd");
      // let body = new FormData();
      // body.append("message", file);
      // body.append("to", user.id);
      // body.append("type", "file");

      // let wordArray = CryptoJS.lib.WordArray.create(file);
      // let encrypted = CryptoJS.AES.encrypt(
      //   JSON.stringify(wordArray),
      //   isAlreadyLogged
      // ).toString();

      // var fileEnc = new Blob([encrypted]);

      // var decrypted = CryptoJS.AES.decrypt(encrypted, isAlreadyLogged); // Decryption: I: Base64 encoded string (OpenSSL-format) -> O: WordArray
      // var typedArray = convertWordArrayToUint8Array(decrypted);
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileData = event.target.result;
        const encryptedData = CryptoJS.AES.encrypt(
          fileData,
          "secret-key"
        ).toString();
        // console.log(encryptedData);
        decryptData(encryptedData);
      };
      reader.readAsDataURL(file);

      /* Converts a cryptjs WordArray to native Uint8Array */
      function CryptJsWordArrayToUint8Array(wordArray) {
        const l = wordArray.sigBytes;
        const words = wordArray.words;
        const result = new Uint8Array(l);
        var i = 0 /*dst*/,
          j = 0; /*src*/
        while (true) {
          // here i is a multiple of 4
          if (i == l) break;
          var w = words[j++];
          result[i++] = (w & 0xff000000) >>> 24;
          if (i == l) break;
          result[i++] = (w & 0x00ff0000) >>> 16;
          if (i == l) break;
          result[i++] = (w & 0x0000ff00) >>> 8;
          if (i == l) break;
          result[i++] = w & 0x000000ff;
        }
        return result;
      }

      const decryptData = (encryptedData) => {
        const decryptedData = CryptoJS.AES.decrypt(encryptedData, "secret-key");
        const decryptedArrayBuffer =
          CryptJsWordArrayToUint8Array(decryptedData);
        const decryptedBlob = new Blob([decryptedArrayBuffer], {
          type: "application/pdf",
        });
        console.log(decryptedBlob);
        setDecryptedFile(decryptedBlob);
      };

      // console.log(typedArray);
      // let response = await axios.post(
      //   `http://localhost:8000/messages/send`,
      //   body,
      //   {
      //     headers: {
      //       userId: isAlreadyLogged,
      //     },
      //   }
      // );
      // console.log(response.data);
      // setFile(null);
      // inputRef.current.value = "";
      // setListOfPost([]);
      // setPage(1);
      // setReload(1 - reload);
      // setHasMore(true);
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
                <Sidebar link="Messages" />
              </Col>
              <Col sm={12} lg={9}>
                <Container className="mt-5">
                  <Row>
                    <a href={`/profile/${user.id}`}>
                      <Col>
                        <MDBCard className="border-light mb-3">
                          <MDBCardBody className="level2 text-white">
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
                                <div className="text-muted">{user.email}</div>
                              </Col>
                            </Row>
                          </MDBCardBody>
                        </MDBCard>
                      </Col>
                    </a>
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
                            <a href={`/profile/${user.id}`}>
                              <img
                                src={
                                  !user.dp || user.dp === ""
                                    ? avatar
                                    : imageLink + user.dp
                                }
                                className="img-thumbnail mb-3"
                                width="50px"
                              />
                            </a>
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
                                {message.type === "message" &&
                                  AES.decrypt(
                                    message.message,
                                    message.from
                                  ).toString(CryptoJS.enc.Utf8)}
                                {message.type === "image" && (
                                  <img
                                    src={imageLink + message.savedFileName}
                                    alt={message.message}
                                    className="w-100"
                                  />
                                )}

                                {message.type === "file" && (
                                  <a
                                    className="text-white"
                                    href={imageLink + message.savedFileName}
                                  >
                                    <i class="fa-solid fa-file-arrow-down"></i>{" "}
                                    {message.message}
                                  </a>
                                )}
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
                      // setBottom(!bottom)
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
                  {decryptedFile && (
                    <a
                      href={URL.createObjectURL(decryptedFile)}
                      download="decrypted-file.pdf"
                    >
                      Download
                    </a>
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
                    <input
                      type="file"
                      ref={inputRef}
                      style={{ display: "none" }}
                      onChange={handleFileUpload}
                    />

                    {file && (
                      <div className="d-flex align-items-center">
                        <p className="ms-3 p-3 border border-dark">
                          {file.name}
                        </p>
                        <div
                          onClick={() => {
                            setFile(null);
                            inputRef.current.value = "";
                          }}
                          className="border border-start-0 border-dark p-3 mb-3"
                        >
                          <i class="fa-regular fa-circle-xmark fa-xl"></i>
                        </div>
                      </div>
                    )}

                    <InputGroup className="mb-3">
                      <Button
                        onClick={handleClick}
                        variant="outline-warning"
                        className="me-2"
                      >
                        <i class="fa-solid fa-paperclip"></i>
                      </Button>
                      <Form.Control
                        type="text"
                        className="me-2"
                        value={message}
                        onChange={handleInputChange}
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
