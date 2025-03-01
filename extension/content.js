// Create the floating container
const container = document.createElement("div");
container.id = "floating-container";
container.style.cssText = `
    position: fixed;
    bottom: 10px;
    left: 10px;
    width: 320px;
    height: 180px;
    background: white;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    border-radius: 10px;
    z-index: 10000;
    resize: both;
    overflow: hidden;
    border: 2px solid #ccc;
    display: flex;
    flex-direction: column;
`;

// Create a draggable header
const header = document.createElement("div");
header.id = "floating-header";
header.style.cssText = `
    width: 100%;
    height: 25px;
    background: #007bff;
    color: white;
    cursor: grab;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    font-size: 14px;
    font-weight: bold;
    user-select: none;
`;

// Add title to the header
const title = document.createElement("span");
title.innerText = "Bias Detector";
header.appendChild(title);

// Create close button
const closeButton = document.createElement("button");
closeButton.innerText = "×";
closeButton.style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
`;

closeButton.addEventListener("click", () => {
    container.remove(); // Remove the entire floating container
});

// Append close button and title to the header
header.appendChild(closeButton);

// Create the iframe
const iframe = document.createElement("iframe");
iframe.src = chrome.runtime.getURL("floating.html");
iframe.style.cssText = `
    width: 100%;
    height: calc(100% - 25px);
    border: none;
    background: white;
`;

// Append header and iframe to the container
container.appendChild(header);
container.appendChild(iframe);
document.body.appendChild(container);

// Dragging logic
let isDragging = false, startX, startY, startLeft, startTop;

header.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = container.offsetLeft;
    startTop = container.offsetTop;
    header.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    let newLeft = startLeft + (e.clientX - startX);
    let newTop = startTop + (e.clientY - startY);
    container.style.left = `${newLeft}px`;
    container.style.top = `${newTop}px`;
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    header.style.cursor = "grab";
});
