import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css';
import mainIcon from "../../extension/mainicon.png";
import Founder from "./founder.jsx";

// Home component (your working App.jsx content)
function Home() {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult('');
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/analyze",
        { url, text },
        {
          headers: {
            "Content-Type": "application/json"
          },
          timeout: 300000  // Optional: set a timeout of 10 seconds
        }
      );
      // Display the full JSON response in a formatted string.
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      if (error.response) {
        setResult(`Error: ${error.response.data.detail}`);
      } else if (error.request) {
        setResult("Error: No response received from the server.");
      } else {
        setResult(`Error: ${error.message}`);
      }
    }
    setLoading(false);
  };

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
    <div className="App" style={{ padding: '20px' }}>
      {/* Navbar */}
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
          <div style={{ fontSize: '22px', fontWeight: 'bold' }}>Fake News Detector</div>
        </div>

        {/* Right: Navigation Links + Download Button */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={navLinkStyle}>
            Home
          </Link>
          <a href="#about" style={navLinkStyle}>
            About
          </a>
          <Link to="/founder" style={navLinkStyle}>
            Founders
          </Link>
          <button style={downloadButtonStyle}>Download</button>
        </div>
      </nav>

      {/* Space to prevent content from being hidden under the fixed navbar */}
      <div style={{ height: '80px' }}></div>

      {/* Main Content */}
      <h1>Bias Detector</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Website URL</label>
          <br />
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setText(''); // Clear text input
            }}
            placeholder="Enter website URL"
            style={{ width: '80%', padding: '8px' }}
            disabled={text.length > 0} // Disable if text is entered
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>Or Paste Text</label>
          <br />
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setUrl(''); // Clear URL input
            }}
            placeholder="Paste text here"
            style={{ width: '80%', height: '150px', padding: '8px' }}
            disabled={url.length > 0} // Disable if URL is entered
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: '10px', padding: '10px 20px' }}
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h2>Analysis Result</h2>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              backgroundColor: '#f4f4f4',
              padding: '10px',
            }}
          >
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}

// Main App with Router added for the Founder page
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/founder" element={<Founder />} />
      </Routes>
    </Router>
  );
}

export default App;