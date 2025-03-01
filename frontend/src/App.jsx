import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Founder from "./founder"; // Import the Founder page

function App() {
  return (
    <Router>
      <div style={styles.container}>
        <Link to="/founder" style={styles.link}>Founders</Link> {/* Link to Founder Page */}
        <h1 style={styles.title}>Bias Detector</h1>
      </div>

      <Routes>
        <Route path="/founder" element={<Founder />} /> {/* Route for Founder Page */}
      </Routes>
    </Router>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
  },
  title: {
    fontSize: "32px",
    marginBottom: "20px",
  },
  link: {
    textDecoration: "none",
    color: "blue",
    fontSize: "20px",
    cursor: "pointer",
  },
};

export default App;
