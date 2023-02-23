import React from "react";
import { Button } from "react-bootstrap";

export default function Footer() {
  const logout = (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.reload(false);
  };

  return (
    <div className="d-grid my-3">
      <Button onClick={logout} variant="warning">
        Logout
      </Button>
    </div>
  );
}
