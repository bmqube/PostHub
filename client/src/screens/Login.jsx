import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Header from "../components/Header";
import { useState } from "react";
import { Alert } from "react-bootstrap";
import axios from "axios";
import { Navigate } from "react-router-dom";

function Login() {
  const [alertClass, setAlertClass] = useState("d-none");
  const [alertMessage, setAlertMessage] = useState("Message");
  const [alertVariant, setAlertVariant] = useState("danger");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isLogged, setIsLogged] = useState(false);

  const isAlreadyLogged = localStorage.getItem("userId");

  const showAlert = (variant, message) => {
    setAlertClass("d-block");
    setAlertMessage(message);
    setAlertVariant(variant);
  };

  const login = async (e) => {
    e.preventDefault();

    if (!emailAddress || !password) {
      showAlert("danger", "Please fill up all fields");
      return;
    }

    const data = {
      email: emailAddress,
      password: password,
    };

    // console.log(birthdate);

    let response = await axios.post("http://localhost:8000/auth/login", data);
    // console.log(response.data);
    if (response.data.code === "SUCCESS") {
      console.log(response.data);
      localStorage.setItem("userId", response.data.data.userId);
      localStorage.setItem("userSessionId", response.data.data.userSessionId);
      showAlert("success", response.data.message);
      setTimeout(() => setIsLogged(true), 1000);
    } else {
      showAlert("danger", response.data.message);
    }
  };

  return (
    <Container>
      {(isLogged || isAlreadyLogged) && <Navigate to="/" />}
      <Row
        className="justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Alert
          variant={alertVariant}
          className={alertClass}
          onClose={() => setAlertClass("d-none")}
          dismissible
        >
          {alertMessage}
        </Alert>
        <Col xs="10" md="8" lg="6" xl="5" className="level1 px-5">
          <Header />
          <Form className="mt-3">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className="text-white">Email address</Form.Label>
              <Form.Control
                onChange={(e) => {
                  setEmailAddress(e.target.value);
                }}
                type="email"
                placeholder="Enter email"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className="text-white">Password</Form.Label>
              <Form.Control
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type="password"
                placeholder="Password"
              />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button onClick={login} variant="warning" type="submit">
                Log In
              </Button>
            </div>
          </Form>
          {/* <div className="my-3 text-end">
            <a
              className="text-warning text-decoration-none"
              href="/reset-password"
            >
              Forgot Password?
            </a>
          </div> */}
          {/* <div className="my-3 text-center text-white">
            <p>or</p>
          </div> */}
          <div className="mt-3 d-grid gap-2 mb-5">
            <Button variant="outline-warning" type="submit">
              <a className="text-decoration-none text-white" href="/register">
                Create new account
              </a>
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
