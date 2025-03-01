import React from 'react'; // Import React library to use JSX
import { Link } from 'react-router-dom'; // Import Link for navigation
import './About.css'; // Import the CSS file for styling
import mainIcon from "../../extension/mainicon.png"; // Logo image import

// Functional Component for About
function About() {
  return (
    <div className="about-container">
      <h1 className="about-heading">About Bias News Detector</h1>

      {/* What Box */}
      <section className="about-box">
        <h2 className="about-subheading">What is Bias News Detector?</h2>
        <p className="about-description">
          Bias News Detector is a tool designed to help you identify biased or misleading content on the internet.
          Our website offers a comprehensive analysis of articles, websites, or text that you enter.
          We use advanced algorithms to determine the reliability of the content and provide you with an unbiased perspective.
          Whether you're browsing articles online or reading news stories, the Bias News Detector helps you make informed decisions.
        </p>
        <p className="about-description">
          In addition to the website feature, we also offer a Google Chrome extension, which allows you to instantly
          analyze news articles and websites with a click of a button, directly from your browser.
        </p>
      </section>

      {/* Why Box */}
      <section className="about-box">
        <h2 className="about-subheading">Why Bias News Detector?</h2>
        <p className="about-description">
          In today's world, misinformation is widespread, and distinguishing between factual content and fake news can be challenging.
          We created Fake News Detector to bring about change by empowering people to make smarter decisions online.
          With the rise of social media and other online platforms, the importance of verifying information has never been greater.
        </p>
        <p className="about-description">
          Our goal is to raise awareness about the prevalence of fake news and equip you with the tools to protect yourself from harmful,
          misleading information. By providing a simple and efficient solution to detect fake news, we hope to encourage critical thinking
          and promote a more informed society.
        </p>
      </section>
    </div>
  );
}

// Navbar Component
function Navbar() {
  // Define navbar link styles
  const navLinkStyle = {
    color: 'white',
    textDecoration: 'none',
    margin: '0 15px',
    fontSize: '18px',
    fontWeight: '500',
  };

  // Define download button styles
  const downloadButtonStyle = {
    backgroundColor: 'white',
    color: '#02182B',
    border: 'none',
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderRadius: '5px',
    marginLeft: '15px',
    whiteSpace: 'nowrap',
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#02182B',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white',
        zIndex: 1000,
        boxSizing: 'border-box',
      }}
    >
      {/* Left: Logo */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={mainIcon}
          alt="Logo"
          style={{ height: '40px', marginRight: '10px' }}
        />
        <div style={{ fontSize: '22px', fontWeight: 'bold' }}>Bias News Detector</div>
      </div>

      {/* Right: Navigation Links + Download Button */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" style={navLinkStyle}>Home</Link>
        <Link to="/about" style={navLinkStyle}>About</Link>
        <Link to="/founder" style={navLinkStyle}>Founders</Link>
        <button style={downloadButtonStyle}>Download Extension</button>
      </div>
    </nav>
  );
}

export { About, Navbar }; // Export components for use in other parts of the app