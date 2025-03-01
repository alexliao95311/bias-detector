document.getElementById("close-btn").addEventListener("click", () => {
    // Remove the iframe element from the parent document
    window.parent.document.getElementById("floating-container").remove();
});
