import React from "react";

function Founder() {
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
      <h1 style={styles.title}>Meet the Team</h1>
      {team.map((member, index) => (
        <div key={index} style={styles.bioContainer}>
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
