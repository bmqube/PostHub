import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Header from "../components/Header";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Profile from "../components/Profile";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import Messages from "../components/Messages";

function MessagePage() {
  const isAlreadyLogged = localStorage.getItem("userId");
  const [effect, setEffect] = useState(true);

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
                <Messages />
              </Col>
            </Row>
          </div>
          <Footer />
        </Col>
      </Row>
    </Container>
  );
}

export default MessagePage;
