import { useState } from "react";
import { Alert } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Form from "react-bootstrap/Form";
import Header from "../components/Header";

function Register() {
  const [fullname, setFullname] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [checked, setChecked] = useState(false);
  const [alertClass, setAlertClass] = useState("d-none");
  const [alertMessage, setAlertMessage] = useState("Message");
  const [alertVariant, setAlertVariant] = useState("danger");

  const showAlert = (variant, message) => {
    setAlertClass("d-block");
    setAlertMessage(message);
    setAlertVariant(variant);
  };

  const register = (e) => {
    e.preventDefault();

    if (
      !fullname ||
      !emailAddress ||
      !password ||
      !password2 ||
      !birthdate ||
      !birthdate ||
      !gender
    ) {
      showAlert("danger", "Please fill up all fields");
    }

    if (!checked) {
      showAlert("danger", "You have to accept the terms and conditions");
    }

    if (password !== password2) {
      showAlert("danger", "Passwords didn't match");
    }

    const data = {
      fullname: fullname,
      email: emailAddress,
      password: password,
      birthdate: birthdate,
      gender: gender,
    };
    console.log(data);
  };

  //onClose={() => setShow(false)} dismissible

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
          <Form
            onChange={() => {
              setAlertClass("d-none");
            }}
          >
            <Form.Group className="mb-3" controlId="formBasicFullname">
              <Form.Label className="text-white">What's your name?</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => {
                  setFullname(e.target.value);
                }}
                placeholder="Enter Fullname"
              />
            </Form.Group>

            <div key={`inline-radio`} className="mb-3"></div>

            <Form.Group className="mb-3" controlId="validationFormik02">
              <Form.Label className="text-white">
                What's your birth date?
              </Form.Label>
              <Form.Control
                type="date"
                name="availableDateTime"
                onChange={(e) => {
                  setBirthdate(e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className="text-white">
                What's your email address?
              </Form.Label>
              <Form.Control
                type="email"
                onChange={(e) => {
                  setEmailAddress(e.target.value);
                }}
                placeholder="Enter email address"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className="text-white">Enter Password</Form.Label>
              <Form.Control
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder="Password"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword2">
              <Form.Label className="text-white">Confirm Password</Form.Label>
              <Form.Control
                type="password"
                onChange={(e) => {
                  setPassword2(e.target.value);
                }}
                placeholder="Password"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicGender">
              <Form.Label className="text-white">
                What's your gender?
              </Form.Label>
              <br />
              {["Male", "Female", "Others"].map((gender) => {
                return (
                  <Form.Check
                    className="text-white"
                    inline
                    label={gender}
                    value={gender.toLocaleLowerCase()}
                    onChange={(e) => {
                      setGender(e.target.defaultValue);
                    }}
                    name="group1"
                    type="radio"
                    id={`inline-radio-${gender}`}
                  />
                );
              })}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check
                type="checkbox"
                className="text-white"
                onChange={(e) => {
                  setChecked(e.target.checked);
                }}
                label="Agree to all terms and conditions"
              />
            </Form.Group>
            <div className="d-grid mb-4">
              <Button variant="warning" onClick={register} type="submit">
                Register
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
