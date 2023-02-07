import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Form from "react-bootstrap/Form";
import Header from "../components/Header";

function Register() {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col sm="4">
          <Header />
          <Form>
            <Form.Group className="mb-3" controlId="formBasicFullname">
              <Form.Label>What's your name?</Form.Label>
              <Form.Control type="text" placeholder="Enter Fullname" />
            </Form.Group>
            <div key={`inline-radio`} className="mb-3">
              {["Male", "Female", "Others"].map((gender) => {
                <Form.Check
                  inline
                  label=":D"
                  name="group1"
                  type="radio"
                  id={`inline-radio-`}
                />;
              })}
            </div>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check
                type="checkbox"
                label="Agree to all terms and conditions"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
