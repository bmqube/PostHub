import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Header from "../components/Header";

function Login() {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col sm="4">
          <Header />
          <Form className="mt-3">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button variant="primary" type="submit">
                Log In
              </Button>
            </div>
          </Form>
          <div className="mt-2 text-center">
            <a
              className="text-primary text-decoration-none"
              href="/reset-password"
            >
              Forgot Password?
            </a>
          </div>
          <div className="my-3 text-center">
            <p>or</p>
          </div>
          <div className="d-grid gap-2">
            <Button variant="outline-secondary" type="submit">
              <a
                className="text-decoration-none text-secondary"
                href="/register"
              >
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
