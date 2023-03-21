import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Header from "../components/Header";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Profile from "../components/Profile";
import Newsfeed from "../components/Newsfeed";
import Footer from "../components/Footer";
import CreatePost from "../components/CreatePost";
import Connections from "../components/Connections";
import Sidebar from "../components/Sidebar";

function ProfilePage() {
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
          <div className="consistent-height px-5">
            <Row className="mt-4">
              <Col sm={12} md={3}>
                <Sidebar link="Profile" />
              </Col>
              <Col sm={12} md={9}>
                <Profile effect={effect} setEffect={setEffect} />
              </Col>
            </Row>
          </div>
          <Footer />
        </Col>
      </Row>
    </Container>
  );
}

export default ProfilePage;
