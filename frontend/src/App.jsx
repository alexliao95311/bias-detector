import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css';
import mainIcon from "../../extension/mainicon.png";
import Founder from "./founder.jsx";
import { About, Navbar } from './About';

// Helper function to parse bold markdown (i.e. **bold text**)
function parseBold(text) {
  // Split the text on occurrences of **...**
  const parts = text.split(/(\*\*.*?\*\*)/);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      // Remove the ** markers and wrap in <strong>
      const boldText = part.slice(2, -2);
      return <strong key={idx}>{boldText}</strong>;
    }
    return <span key={idx}>{part}</span>;
  });
}

// Home component (your working App.jsx content)
function Home() {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  // Store result as an object (e.g., { analysis: [...] })
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
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
      // Save the parsed JSON response
      setResult(response.data);
    } catch (error) {
      if (error.response) {
        setResult({ analysis: [`Error: ${error.response.data.detail}`] });
      } else if (error.request) {
        setResult({ analysis: ["Error: No response received from the server."] });
      } else {
        setResult({ analysis: [`Error: ${error.message}`] });
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
      {/* Inline Navbar */}
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
        <div style={{ margin: "50px" }}>
          <label style={{ fontSize: "25px" }}>Website URL</label>
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
            disabled={text.length > 0}
          />
        </div>
        <div style={{ margin: '50px' }}>
          <label style={{ fontSize: "25px" }}>Or Paste Text</label>
          <br />
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setUrl('');
            }}
            placeholder="Paste text here"
            style={{ width: '80%', height: '150px', padding: '8px' }}
            disabled={url.length > 0}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ 
            ...downloadButtonStyle, 
            backgroundColor: '#D7263D', 
            width: "140px",
            height: "40px",
            color: 'white',
            fontSize: '18px',
            marginTop: "15px",
          }}
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>

      {result && (
        <div style={{ 
          marginTop: '20px', 
          backgroundColor: '#f4f4f4', 
          padding: '15px', 
          borderRadius: '5px',
          lineHeight: '1.6em'
        }}>
          <h2>Analysis Result</h2>
          {Array.isArray(result.analysis) ? (
            result.analysis.map((para, idx) => {
              const trimmed = para.trim();
              if (trimmed.startsWith('#### ')) {
                return (
                  <h4 key={idx} style={{ marginBottom: '15px' }}>
                    {parseBold(trimmed.substring(5))}
                  </h4>
                );
              } else if (trimmed.startsWith('### ')) {
                return (
                  <h3 key={idx} style={{ marginBottom: '15px' }}>
                    {parseBold(trimmed.substring(4))}
                  </h3>
                );
              } else if (trimmed.startsWith('## ')) {
                return (
                  <h2 key={idx} style={{ marginBottom: '15px' }}>
                    {parseBold(trimmed.substring(3))}
                  </h2>
                );
              } else if (trimmed.startsWith('# ')) {
                return (
                  <h1 key={idx} style={{ marginBottom: '15px' }}>
                    {parseBold(trimmed.substring(2))}
                  </h1>
                );
              } else {
                return (
                  <p key={idx} style={{ marginBottom: '15px' }}>
                    {parseBold(para)}
                  </p>
                );
              }
            })
          ) : (
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Navbar /> {/* This will render the navbar globally */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/founder" element={<Founder />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;