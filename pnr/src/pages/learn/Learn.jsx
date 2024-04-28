import React, { useState, useEffect } from "react";
import Transition from "../../components/transition/Transition";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";
import HomeButton from "../../components/homebutton/HomeButton";
import { useLevelLanguage } from "../../contexts/LevelLanguageContext";
import { useStory } from "../../contexts/StoryContext";

import "./learn.css";

const Learn = () => {
  const { selectedLevel, selectedLanguage } = useLevelLanguage();
  const { setStory } = useStory();
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const handleStorySelect = (story) => {
    setStory(story);
    navigate(`/sample-blog/${story.id}`);
  };
  

  useEffect(() => {
    console.log("Selected Language:", selectedLanguage);
  console.log("Selected Level:", selectedLevel);
  const generateDefaultStories = () => {
    if (!selectedLanguage || !selectedLevel) {
      console.error("Language or level not selected.");
      return [];
    }
  
    const defaultStories = [
      { id: 1, title: "Learning New Words", subtitle: "Expand your vocabulary with these engaging stories." },
      { id: 2, title: "Learning New Grammar", subtitle: "Master grammar rules with fun and informative content." },
      { id: 3, title: "Exploring Culture", subtitle: "Discover the rich cultural heritage of various regions." },
    ];
  
    return defaultStories;
  };

    setStories(generateDefaultStories());
  }, [selectedLanguage, selectedLevel]);
  console.log("Stories:", stories);
  return (
    <div className="blog page">
      <div className="container">
        <div className="blog-hero">
          <h1>
            Curated {selectedLanguage || "Select a language"} content for <span>you</span> - <span>{selectedLevel || "Select a level"}</span>
          </h1>
        </div>

        <section className="blogs">
          {stories.map((story) => (
            <div className="blog-row" key={story.id}>
              <div className="blog-col">
                <div className="blog-item" onClick={() => handleStorySelect(story)} role="button" tabIndex="0">
                  <div className="blog-divider">
                    <div className="b-div-1"></div>
                    <div className="b-div-2"></div>
                  </div>

                  <div className="blog-title-wrapper">
                    <div className="blog-title">
                      <h3>{story.title}</h3>
                      <p><span>{story.subtitle}</span></p>
                    </div>
                    
                  <div className="blog-arrow">
                    <ArrowRight size={32} weight="light" color="#fff" />
                  </div>
                </div>
                </div>
              </div>
            </div>
          ))}
        </section>


        <HomeButton />
      </div>
    </div>
  );
};

export default Transition(Learn);
