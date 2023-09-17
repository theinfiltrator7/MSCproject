import React from "react";
import "./Navbar.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();

  function signOut() {
    Cookies.remove("token");
    navigate("/login");
  }

  return (
    <div className="navbarWrapper">
      <div className="logo">Effectivesync</div>
      <div className="filler" />
      <div className="optionWrapper" onClick={signOut}>
        <img className="navIcon" src={require("../../assets/logout.png")} />
        <div className="option">Sign Out</div>
      </div>
    </div>
  );
};

export default Navbar;
