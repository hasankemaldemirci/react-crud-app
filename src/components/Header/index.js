import React from "react";

// Styles
import "./style.scss";

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <a href="/" className="logo">
          React CRUD App
        </a>
      </div>
    </header>
  );
};

export default Header;
