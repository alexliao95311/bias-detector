import React, { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    // Change the URL below if your backend is hosted elsewhere.
    const endpoint = "http://localhost:8000/analyze";
    // Here we send as text, but you can extend logic to handle URLs separately.
    const payload = { text: input };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResult(JSON.stringify(data.result, null, 2));
    } catch (error) {
      console.error("Error:", error);
      setResult("An error occurred while processing your request.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Bias Detector</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <textarea
          placeholder="Paste website URL or text here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.textarea}
        />
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>
      {result && (
        <div style={styles.resultContainer}>
          <h2>Analysis Result:</h2>
          <pre style={styles.pre}>{result}</pre>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "20px",
  },
  title: {
    marginBottom: "20px",
    textAlign: "center",
  },
  form: {
    width: "100%",
    maxWidth: "600px",
    textAlign: "center",
  },
  textarea: {
    width: "100%",
    height: "100px",
    marginBottom: "10px",
    padding: "10px",
    fontSize: "16px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
  resultContainer: {
    marginTop: "20px",
    width: "100%",
    maxWidth: "600px",
    textAlign: "left",
  },
  pre: {
    background: "#f0f0f0",
    padding: "10px",
    overflowX: "auto",
  },
};

export default App;