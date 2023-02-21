import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

export default function Header() {
  const isAlreadyLogged = localStorage.getItem("userId");
  let alignment = "text-center";

  if (isAlreadyLogged) {
    alignment = "text-start";
  } else {
  }

  return (
    <p
      className={`mt-3 text-warning fw-bold fs-3 font-monospace ${isAlreadyLogged}`}
    >
      PostHub
    </p>
  );
}
