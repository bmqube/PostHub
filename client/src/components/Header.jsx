import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";

export default function Header() {
  const isAlreadyLogged = localStorage.getItem("userId");
  const name = localStorage.getItem("name");
  let alignment = "center";

  if (isAlreadyLogged) {
    alignment = "between";
  } else {
    alignment = "center";
  }

  return (
    // <div className={`d-flex justify-content-${alignment}`}>
    //   <p className={`mt-3 text-warning fw-bold fs-3 font-monospace`}>PostHub</p>
    //   <Button variant="secondary" size="sm">
    //     Log Out
    //   </Button>
    // </div>

    <Navbar className="level1">
      <Container>
        <Navbar.Brand
          className="text-warning fw-bold fs-3 ps-3 font-monospace"
          href="/"
        >
          PostHub
        </Navbar.Brand>
        {isAlreadyLogged && (
          <>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text className="text-white">
                Signed in as:{" "}
                <a className="text-white" href="#login">
                  {name}
                </a>
              </Navbar.Text>
            </Navbar.Collapse>
          </>
        )}
      </Container>
    </Navbar>
  );
}
