import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Header from "../components/Header";
import { useState } from "react";
import { Alert } from "react-bootstrap";

function Login() {
  const [alertClass, setAlertClass] = useState("d-none");
  const [alertMessage, setAlertMessage] = useState("Message");
  const [alertVariant, setAlertVariant] = useState("danger");

  const showAlert = (variant, message) => {
    setAlertClass("d-block");
    setAlertMessage(message);
    setAlertVariant(variant);
  };
  return (
    <Container>
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
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className="text-white">Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button variant="warning" type="submit">
                Log In
              </Button>
            </div>
          </Form>
          <div className="my-3 text-end">
            <a
              className="text-warning text-decoration-none"
              href="/reset-password"
            >
              Forgot Password?
            </a>
          </div>
          {/* <div className="my-3 text-center text-white">
            <p>or</p>
          </div> */}
          <div className="d-grid gap-2 mb-5">
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
