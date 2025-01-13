import React from "react";
import Logo from "../../../assets/images/logos/logo.svg";

import "./header.scss";

const Header = ({ sectionLogo }) => {
  return (
    <div className="header-container">
      <div className="nav">
        <div className="logo">
          <img src={Logo} alt="Alphaverse logo" />
          <a href="/home" className="logo-text">
            Alphaverse
          </a>
        </div>

        {sectionLogo && (
          <div className="sectionLogo">
            <img src={sectionLogo} alt="section logo" />
          </div>
        )}

        <div className="nav-links">
          <div className="navbar-btn">
            <button className="button button-simple mr-1">
              <a className="padding" href={process.env.REACT_APP_REGISTER_LINK} target="blank">
                Register
              </a>
            </button>
            <button className="button button-black button-simple">
              <a href={process.env.REACT_APP_WHITEPAPER_LINK} target="blank">
                Whitepaper
              </a>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
