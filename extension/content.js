// Create the floating icon
const icon = document.createElement("div");
icon.id = "bias-detector-icon";
icon.style.cssText = `
    position: fixed;
    bottom: 15px;
    left: 15px;
    width: 50px;
    height: 50px;
    background-image: url('${chrome.runtime.getURL("mainicon.png")}');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 50%;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    cursor: pointer;
    z-index: 10000;
`;

// Create the floating window (hidden at start)
const container = document.createElement("div");
container.id = "floating-container";
container.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    width: 500px; /* Increased width */
    height: 300px; /* Increased height */
    background: white;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    border-radius: 10px;
    z-index: 10000;
    display: none;
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
    transition: opacity 0.3s ease, transform 0.3s ease;
    resize: both;
    overflow: auto;
`;

// Create the content area to display the analysis result
const analysisResult = document.createElement("div");
analysisResult.id = "analysis-result";
analysisResult.style.cssText = `
    padding: 15px;
    font-size: 14px;
    color: #555;
    overflow-y: auto;
    max-height: 100%;
    white-space: pre-wrap;
`;

// Append the analysis result div to the container
container.appendChild(analysisResult);

// Append the icon and container (with analysis result) to the document body
document.body.appendChild(icon);
document.body.appendChild(container);

// Toggle window visibility on icon click
icon.addEventListener("click", async () => {
    if (container.style.display === "none" || container.style.opacity === "0") {
        // Show with animation
        container.style.display = "block";
        setTimeout(() => {
            container.style.opacity = "1";
            container.style.transform = "translate(-50%, -50%) scale(1)";
        }, 10);

        // Get the current URL of the page
        const url = window.location.href;

        // Extract the content of the page
        const pageContent = document.body.innerText; // You can modify this to target specific elements

        // Send the extracted content to the FastAPI backend for analysis
        if (pageContent) {
            try {
                const response = await fetch("http://localhost:8000/analyze", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        text: pageContent, // Send the extracted page content
                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch analysis");
                }

                const result = await response.json();

                // Display the analysis result in the floating window
                analysisResult.innerHTML = `
                    <h3>Bias Analysis</h3>
                    <p><strong>Overall Bias:</strong> ${result.overallBias}</p>
                    <p><strong>Analysis:</strong></p>
                    <p>${result.analysis}</p>
                `;
            } catch (error) {
                console.error("Error fetching analysis:", error);
            }
        }
    } else {
        // Hide with animation
        container.style.opacity = "0";
        container.style.transform = "translate(-50%, -50%) scale(0.8)";
        setTimeout(() => {
            container.style.display = "none";
        }, 300);
    }
});
