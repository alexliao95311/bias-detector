import React, { useState } from "react";
import group from "./assets/group.png";

function Founder() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const team = [
    {
      name: "Vaidehi Akbari",
      bio: "Founder and developer of the Bias Detector app, passionate about technology and social justice.",
    },
    {
      name: "Alex Liao",
      bio: "Backend engineer who ensures the app runs smoothly and processes data efficiently.",
    },
    {
      name: "Shely Jain",
      bio: "UI/UX designer who makes the app user-friendly and visually appealing.",
    },
    {
      name: "Sanjana Gowda",
      bio: "Marketing lead focused on spreading awareness about the app's mission.",
    },
    {
      name: "Arnav Gupta",
      bio: "Data scientist who works on training the bias detection models.",
    },
  ];

  return (
    <div style={styles.container}>
      <img src={group} alt="hello" style={{ width: "300px", height: "auto" }} /> {/* Image resized */}
      <h1 style={styles.title}>Meet the Team</h1>
      {team.map((member, index) => (
        <div
          key={index}
          style={{
            ...styles.bioContainer,
            ...(hoveredIndex === index ? styles.bioContainerHover : {}),
          }}
          onMouseEnter={() => setHoveredIndex(index)} // Set index on hover
          onMouseLeave={() => setHoveredIndex(null)} // Reset on hover out
        >
          <h2>{member.name}</h2>
          <p>{member.bio}</p>
        </div>
      ))}
      <a href="/" style={styles.link}>Back to Home</a> {/* Back to Home Link */}
    </div>
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
  bioContainer: {
    margin: "20px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    maxWidth: "600px",
    marginLeft: "auto",
    marginRight: "auto",
    background: "#f9f9f9",
    transition: "transform 0.2s ease, box-shadow 0.2s ease", // Smooth transition for hover effect
  },
  bioContainerHover: {
    transform: "scale(1.05)", // Slightly enlarges the box
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Adds a subtle shadow
  },
  link: {
    textDecoration: "none",
    color: "blue",
    marginTop: "20px",
    display: "inline-block",
    fontSize: "18px",
  },
};

export default Founder;
