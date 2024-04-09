import React, { useState } from "react";
import Transition from "../../components/transition/Transition";

import "./profile.css";

import MagneticButton from "../../components/magneticbutton/MagneticButton";

const Profile = () => {
  const username = localStorage.getItem('username');

  const [selectedLevel, setSelectedLevel] = useState("");

  const handleLevelChange = (level) => {
    setSelectedLevel(level);
    localStorage.setItem('selectedLevel', level);
  };
  

  return (
    <div className="contact page">
      <div className="container">
        <section className="contact-hero">
          <div className="contact-row">
            <div className="contact-col"></div>
            <div className="contact-col">
              <h1>
                Welcome, <span>{username}</span>
              </h1>
            </div>
          </div>
        </section>

        <section className="section contact-form">
          <div className="contact-row">
            <div className="contact-col">
              <p>
                <span>Update Profile</span>
              </p>
            </div>
            <div className="contact-col">
              <form action="">
                <div className="input">
                  <input type="text" placeholder="New Username" />
                </div>
                <div className="input">
                  <input type="text" placeholder="New Password" />
                </div>
              </form>
            </div>
          </div>
        </section>

        <section className="contact-subscribe">
          <div className="contact-row">
            <div className="contact-col">
              <p>
                <span>Select Desired Content Level</span>
              </p>
            </div>
            <div className="contact-col">
              <h3>
                Choose a level that you would like your content to reflect
              </h3>
              <p>
                Your growth starts with failure and learning from it.
              </p>
              <div className="level-selection">
                <ul>
                  <li className={selectedLevel === "Beginner" ? "active" : ""} onClick={() => handleLevelChange("Beginner")}>Beginner</li>
                  <li className={selectedLevel === "Elementary" ? "active" : ""} onClick={() => handleLevelChange("Elementary")}>Elementary</li>
                  <li className={selectedLevel === "Intermediate" ? "active" : ""} onClick={() => handleLevelChange("Intermediate")}>Intermediate</li>
                  <li className={selectedLevel === "Advanced" ? "active" : ""} onClick={() => handleLevelChange("Advanced")}>Advanced</li>
                  <li className={selectedLevel === "Fluent" ? "active" : ""} onClick={() => handleLevelChange("Fluent")}>Fluent</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

       
        <MagneticButton />
      </div>
    </div>
  );
};

export default Transition(Profile);
