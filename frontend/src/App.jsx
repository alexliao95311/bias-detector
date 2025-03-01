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
          <a href="#" style={navLinkStyle}>
            Home
          </a>
          <a href=".../..About.jsx" style={navLinkStyle}>
            About
          </a>
          <a href="#founders" style={navLinkStyle}>
            Founders
          </a>
          <button style={downloadButtonStyle}>Download Extension</button>
        </div>
      </nav>

      {/* Space to prevent content from being hidden under the fixed navbar */}
      <div style={{ height: '90px' }}></div>
        {/* Download & Description Section */}
        <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        margin: '20px auto',
        padding: '20px',
        backgroundColor: '#f4f4f4',
        borderRadius: '10px'
      }}>
        {/* Download Button */}
        <button style={{ 
          ...downloadButtonStyle, 
          backgroundColor: '#02182B', 
          width: "190px",
          height: "50px",
          color: 'white',
          fontSize: '18px',
          marginLeft: "5%",
        
        }}>
          Download
        </button>

        {/* Description */}
        <p style={{ 
          margin: '0',
          fontSize: '18px',
          color: '#333',
          textAlign: 'left',
          maxWidth: '70%',
          lineHeight: "30px"
        }}>
          Download our Bias Detecting Chrome Extension, a powerful tool that instantly flags biased content related to race, gender, and other social issues as you browse. Using advanced AI and natural language processing, it analyzes text in real-time, providing immediate feedback and explanations to help you recognize and understand potential bias. Designed for seamless integration, our extension promotes social awareness and empowers users to navigate the internet more critically. Get it today to stay informed and combat misinformation effortlessly!          
        </p>
      </div>
      {/* Main Content */}
      <h1>Bias Detector</h1>
      <form onSubmit={handleSubmit}>
        <div style={{margin:"25px"}}>
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
        <div style={{ margin: '25px' }}>
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
          style={{ 
            ...downloadButtonStyle, 
            backgroundColor: '#02182B', 
            width: "140px",
            height: "40px",
            color: 'white',
            fontSize: '18px',
            marginLeft: "5%",
            marginTop: "15px",
          
          }}
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