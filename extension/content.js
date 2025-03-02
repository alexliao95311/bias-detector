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
    width: 350px;
    height: 200px;
    background: white;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    border-radius: 10px;
    z-index: 10000;
    display: none;
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
    transition: opacity 0.3s ease, transform 0.3s ease;
`;

// Create the iframe (only iframe, no extra HTML structure)
const iframe = document.createElement("iframe");
iframe.src = chrome.runtime.getURL("floating.html");
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
icon.addEventListener("click", () => {
    if (container.style.display === "none" || container.style.opacity === "0") {
        // Show with animation
        container.style.display = "block";
        setTimeout(() => {
            container.style.opacity = "1";
            container.style.transform = "translate(-50%, -50%) scale(1)";
        }, 10);
    } else {
        // Hide with animation
        container.style.opacity = "0";
        container.style.transform = "translate(-50%, -50%) scale(0.8)";
        setTimeout(() => {
            container.style.display = "none";
        }, 300);
    }
});

// Create close button and add the functionality
const closeButton = document.createElement("button");
closeButton.innerText = "×";
closeButton.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
`;

// Close the floating window when clicking the close button
closeButton.addEventListener("click", () => {
    container.style.opacity = "0";
    container.style.transform = "translate(-50%, -50%) scale(0.8)";
    setTimeout(() => {
        container.style.display = "none";
    }, 300);
});

// Append close button to container (only shown when window is opened)
container.appendChild(closeButton);
