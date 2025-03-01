import React, { useState } from "react";
import group from "./assets/group.png"; // Image import
import './Founders.css'; // Import CSS for styling

function Founders() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const team = [
    {
      name: "Vaidehi Akbari",
      bio: `Vaidehi Akbari is passionate about computer science, focusing on artificial intelligence and cybersecurity. She aspires to protect digital systems and ensure information security. As co-president of the Poverty Patch Up initiative and VP of Girls Who Code, she advocates for social impact and inclusivity in tech.`,
    },
    {
      name: "Alex Liao",
      bio: `Alex Liao balances his love for swimming, music, and software engineering. He aims to build innovative software solutions and improve user experiences. His dedication to both athletics and tech positions him as a future leader in the field of software development.`,
    },
    {
      name: "Shely Jain",
      bio: `Shely Jain is a volleyball player and aspiring engineer who leads the Indian Student Association at her school. She’s passionate about baking and believes in the power of cultural diversity and community. She strives to excel in both academics and leadership, while making a positive impact through her various roles.`,
    },
    {
      name: "Sanjana Gowda",
      bio: `Sanjana Gowda is a multi-talented swimmer, dancer, and alto sax player who aspires to become a software engineer. She is also co-president of the Indian Student Association, leading initiatives that foster inclusivity. Sanjana is committed to balancing her passions and pursuing a career in tech.`,
    },
    {
      name: "Arnav Kakani",
      bio: `Arnav Kakani is a golfer and treasurer of the Indian Student Association at his school. He aspires to work in computer science, using his organizational and technical skills to create innovative solutions. Arnav is committed to developing both his leadership and technical abilities for a future in tech.`,
    },
  ];

  return (
    <div className="founders-container">
      <img src={group} alt="Founders Group" className="founders-image" />
      <h1 className="founders-title">Meet the Team</h1>
      {team.map((member, index) => (
        <div
          key={index}
          className={`founders-box ${hoveredIndex === index ? "founders-box-hover" : ""}`}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <h2 className="founders-name">{member.name}</h2>
          <p className="founders-bio">{member.bio}</p>
        </div>
      ))}
    </div>
  );
}

export default Founders;
