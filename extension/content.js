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

// Create the iframe (used to display the existing website)
const iframe = document.createElement("iframe");
iframe.src = "http://20.3.246.40:8000";  // Replace with your existing website URL
iframe.style.cssText = `
    width: 100%;
    height: 100%;
    border: none;
    background: white;
`;

// Append the iframe to the container
container.appendChild(iframe);

// Append the icon and container (with iframe) to the document body
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

        // Get URL or text to analyze
        const url = window.location.href;
        const selectedText = window.getSelection().toString().trim();

        let textToAnalyze = selectedText || url; // Prioritize selected text if any

        // Send the analysis request to the FastAPI backend
        if (textToAnalyze) {
            try {
                const response = await fetch("http://localhost:8000/analyze", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        text: textToAnalyze, // You can also send the URL here if necessary
                    }),
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch analysis");
                }

                const result = await response.json();

                // Pass the result to the iframe (or display it in the window)
                const iframeWindow = iframe.contentWindow;

                // If needed, you can directly post the result data to the iframe here
                iframeWindow.postMessage(result, "*");

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
