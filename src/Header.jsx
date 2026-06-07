import React from "react";
import { Navbar } from "react-bootstrap";

function Header(props) {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand className=" mr-auto ml-auto">
        <h3 className="heading">{props.name}</h3>{" "}
      </Navbar.Brand>
    </Navbar>
  );
}

export default Header;
