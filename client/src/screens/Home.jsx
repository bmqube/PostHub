import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
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

function Home() {
  const isAlreadyLogged = localStorage.getItem("userId");
  const [key, setKey] = useState("newsfeed");
  const [effect, setEffect] = useState(true);

  return (
    <Container>
      {!isAlreadyLogged && <Navigate to="/login" />}
      <Row
        className="justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Col xs="10" md="8" lg="6" xl="5" className="level1 px-5">
          <Header />
          <div className="consistent-height">
            <Tabs
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-3 tab"
              justify
              fill
            >
              <Tab eventKey="newsfeed" title="Home">
                <CreatePost effect={effect} setEffect={setEffect} />
                <Newsfeed effect={effect} />
              </Tab>
              <Tab eventKey="profile" title="Profile">
                <CreatePost effect={effect} setEffect={setEffect} />
                <Profile effect={effect} />
              </Tab>
              <Tab eventKey="connections" title="Connections">
                <Connections />
              </Tab>
            </Tabs>
          </div>
          <Footer />
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
