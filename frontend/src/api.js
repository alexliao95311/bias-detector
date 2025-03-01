import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export const analyzeURL = async (url) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/analyze`, { url });
        return response.data;
    } catch (error) {
        console.error("Error analyzing:", error);
        return { error: "Failed to analyze the URL" };
    }
};