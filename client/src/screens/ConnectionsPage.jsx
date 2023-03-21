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

function ConnectionsPage() {
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
        <Col sm="10" className="level1 p-0">
          <Header />
          <div className="consistent-height px-5">
            {/* <Tabs
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-3 tab"
              justify
              fill
            >
              <Tab eventKey="newsfeed" title="Home">
                <CreatePost effect={effect} setEffect={setEffect} />
                <Newsfeed effect={effect} setEffect={setEffect} />
              </Tab>
              <Tab eventKey="profile" title="Profile">
                <CreatePost effect={effect} setEffect={setEffect} />
                <Profile effect={effect} />
              </Tab>
              <Tab eventKey="connections" title="Connections">
                <Connections />
              </Tab>
            </Tabs> */}

            {/* <Tab.Container id="sidebar" defaultActiveKey={key}>
              <Row className="mt-4">
                <Col sm={3}>
                  <Nav variant="tabs" className="flex-column">
                    <Nav.Item>
                      <Nav.Link eventKey="newsfeed">Home</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="profile">Profile</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="connections">Connections</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>
                <Col sm={9}>
                  <Tab.Content>
                    <Tab.Pane eventKey="newsfeed" title="Home">
                      <CreatePost effect={effect} setEffect={setEffect} />
                      <Newsfeed effect={effect} setEffect={setEffect} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="profile" title="Profile">
                      <CreatePost effect={effect} setEffect={setEffect} />
                      <Profile effect={effect} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="connections" title="Connections">
                      <Connections />
                      <Sidebar />
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container> */}
            <Row className="mt-4">
              <Col sm={3}>
                <Sidebar link="Connections" />
              </Col>
              <Col sm={9}>
                <Connections />
              </Col>
            </Row>
          </div>
          <Footer />
        </Col>
      </Row>
    </Container>
  );
}

export default ConnectionsPage;
