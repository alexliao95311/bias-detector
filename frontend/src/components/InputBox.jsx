import { useState } from "react";

const InputBox = ({ onAnalyze }) => {
  const [url, setUrl] = useState("");

  return (
    <div className="input-container">
      <input
        type="text"
        placeholder="Paste a news article URL..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={() => onAnalyze(url)}>Analyze</button>
    </div>
  );
};

export default InputBox;