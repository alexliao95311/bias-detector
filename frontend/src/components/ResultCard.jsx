const ResultCard = ({ result }) => {
    if (!result) return null;
  
    return (
      <div className="result-card">
        <h3>Analysis Result</h3>
        <p><strong>URL:</strong> {result.url}</p>
        <p><strong>Bias:</strong> {result.bias_analysis}</p>
      </div>
    );
  };
  
  export default ResultCard;