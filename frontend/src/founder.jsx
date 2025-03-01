import React, { useState } from "react";
import group from "./assets/group.png";

function Founder() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const team = [
    {
      name: "Vaidehi Akbari",
      bio: `Vaidehi Akbari has a profound passion for computer science and is committed to expanding her knowledge in the field. She is particularly focused on deepening her understanding of artificial intelligence, striving to stay at the forefront of this rapidly growing area. With a strong foundation in coding, she is actively learning a variety of programming languages to enhance her technical skills and broaden her expertise. Vaidehi is determined to make significant contributions to the tech industry, especially in areas that intersect with cybersecurity.

In addition to her technical pursuits, Vaidehi is aspiring to build a career in cybersecurity, where she plans to protect digital systems and safeguard sensitive information. Her interest in this field aligns with her desire to use her skills for the greater good, ensuring the security of technology in an increasingly connected world.

Beyond her academic and career ambitions, Vaidehi is also the co-president of the Emerald High School Poverty Patch Up initiative, where she works alongside peers to address poverty-related issues in the local community. Her leadership role allows her to apply her problem-solving abilities in meaningful ways and positively impact those in need.

Vaidehi is also the Vice President of Girls Who Code at her school, where she helps empower and mentor young women in the field of technology. Her dedication to encouraging more female representation in tech drives her involvement with the club, where she works on projects that promote inclusivity and growth in computer science.

With her strong work ethic, diverse interests, and drive to make a difference, Vaidehi continues to grow as a dedicated student and future professional in both the tech and social impact sectors.`,
    },
    {
      name: "Alex Liao",
      bio: `Alex Liao is a talented swimmer and pianist, balancing his athletic and musical pursuits with his passion for software engineering. As a swimmer, Alex demonstrates discipline, dedication, and teamwork, qualities that also reflect in his academic and personal endeavors. He is an accomplished pianist with remarkable skills, finding joy in creating music and exploring new compositions. 

Alex aspires to become a software engineer, with a specific interest in building innovative software solutions and improving user experiences. His dedication to software development, combined with his creativity and strong problem-solving abilities, makes him eager to contribute to the world of technology. Whether it's in the water or at the piano, Alex strives for excellence, and his ambition to succeed in the tech industry reflects that same drive.

In addition to his pursuits in swimming, music, and software engineering, Alex works tirelessly to develop his technical skills and prepare for a future as a software engineer. His ability to balance multiple interests and his dedication to his goals make him a promising young talent in the field.`,
    },
    {
      name: "Shely Jain",
      bio: `Shely Jain is a dedicated volleyball player with aspirations to become an engineer. Her passion for sports has taught her discipline, teamwork, and perseverance, all of which she applies to her academic and personal life. Shely is currently the co-president of the Emerald High School Indian Student Association, where she plays a key role in organizing events and initiatives that promote cultural awareness, celebrate diversity, and foster community engagement. Her leadership in this role allows her to create an inclusive environment where students from all backgrounds can connect and learn from one another.

Beyond her leadership and academic pursuits, Shely has a deep love for baking. She enjoys experimenting with new recipes and flavors, often sharing her culinary creations with friends, family, and her peers. Her passion for baking has become a creative outlet that allows her to express herself and spread joy to those around her. Whether it's a simple cake or a more elaborate dessert, Shely’s baking reflects her attention to detail and her dedication to making something meaningful.

Shely is also committed to her role as the co-president of the Indian Student Association, helping to lead the club with initiatives that foster cultural understanding and celebrate diversity.

Her diverse interests and ability to balance multiple responsibilities have made Shely a well-rounded individual. She excels in both sports and academics, with a focus on engineering, and is constantly striving to improve and take on new challenges. Shely is committed to her goals and remains driven by her desire to make a positive impact, whether it’s through her leadership, academic pursuits, or personal endeavors.`,
    },
    {
      name: "Sanjana Gowda",
      bio: `Sanjana Gowda is a multi-talented individual with a wide range of interests and talents. She is an accomplished swimmer, demonstrating discipline and determination in the pool, and is a key member of the competitive Emerald High School Hip-Hop team, where her passion for dance and teamwork shine through. Alongside her athletic pursuits, Sanjana is an alto sax player, showcasing her musical talents and love for music. She also works as a lifeguard, where she applies her responsibility and quick decision-making skills to ensure the safety of others.

Sanjana aspires to become a software engineer, combining her problem-solving abilities and technical interests to make meaningful contributions in the tech industry. With her diverse skills in athletics, music, and work experience, Sanjana is dedicated to balancing multiple passions and is committed to achieving her goals in both her personal and professional life.

Sanjana also serves as the co-president of the Emerald High School Indian Student Association, where she helps lead initiatives aimed at fostering a supportive and inclusive environment for all students. Her leadership in this role allows her to play a pivotal part in shaping the culture and community within her school.`,
    },
    {
      name: "Arnav Kakani",
      bio: `Arnav Kakani is the treasurer of the Emerald High School Indian Student Association, balancing his leadership role with his passion for golf. His involvement in the student association allows him to apply his organizational and financial skills while contributing to the club's initiatives. As a golfer, Arnav demonstrates dedication and focus in both his academic and extracurricular pursuits. 

Arnav aspires to work in the computer science field, where he hopes to apply his skills and passion for technology to create innovative solutions. His leadership role in the Indian Student Association has also allowed him to develop skills in managing budgets and fostering community engagement, which he aims to carry with him into his future career in tech. Arnav is committed to developing both his technical and leadership skills as he works towards achieving his long-term goals.`,
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
};

export default Founder;
