import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom for navigation

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          MySite
        </Link>
        <ul className="navbar-links">
          <li>
            <Link to="/" className="navbar-item">Home</Link>
          </li>
          <li>
            <Link to="/about" className="navbar-item">About</Link>
          </li>
          <li>
            <Link to="/services" className="navbar-item">Services</Link>
          </li>
          <li>
            <Link to="/contact" className="navbar-item">Contact</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
