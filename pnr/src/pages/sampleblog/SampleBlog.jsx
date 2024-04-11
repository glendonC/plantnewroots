import React, { useEffect, useState } from "react";
import { useStory } from "../../contexts/StoryContext";
import { useParams, useLocation } from "react-router-dom";
import Transition from "../../components/transition/Transition";
import WorkImg1 from "../../assets/images/work/writing.jpg";
import MagneticButton from "../../components/magneticbutton/MagneticButton";
import "./sample-blog.css";
import { useLevelLanguage } from "../../contexts/LevelLanguageContext";


function SampleBlog() {
  const { id } = useParams();
  const { story } = useStory();
  const { title, subtitle } = story;
  const { selectedLevel, selectedLanguage } = useLevelLanguage();


  const [content, setContent] = useState('');

  console.log("Full location object:", location);

 
  useEffect(() => {
    const generateContent = async () => {
      console.log("Title:", title);
      console.log("Subtitle:", subtitle);

      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      let prompt = '';
      const levelDescriptor = selectedLevel.toLowerCase() === 'elementary' ? 'basic' : selectedLevel.toLowerCase();

      switch (title.toLowerCase()) {
        case "learning new words":
          prompt = `Generate 5 ${levelDescriptor} words with their translations and an example of each being used in context in ${selectedLanguage}.`;
          break;
        case "learning new grammar":
          prompt = `Generate 5 ${levelDescriptor} grammar points with their explanations and an example of each being used in context in ${selectedLanguage}.`;
          break;
        case "exploring culture":
          prompt = `Generate a brief 5-10 sentence post about some part of the language relating to the culture to enhance the user's perspective on the culture in ${selectedLanguage}.`;
          break;
        default:
          prompt = `Create a ${levelDescriptor} lesson around the topic "${title}" for ${subtitle}, tailored to a ${selectedLanguage} language learner.`;
          break;
      }

      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const generatedText = await response.text();
        setContent(generatedText);
      } catch (error) {
        console.error('Error generating content:', error);
        setContent('Failed to load story content.');
      }
    };

    generateContent();
  }, [id, title, subtitle, selectedLanguage]);

  return (
    <div className="sample-blog page">
      <div className="container">
        <div className="s-blog-hero">
          <h2>{title}</h2>
        </div>

        <div className="blog-content">
          <div className="s-blog-col scroll">
            <p><span>{subtitle}</span></p>
            <p>{content}</p>
          </div>
          <div className="s-blog-col sticky">
            <p id="blog-share">
              <span>Share</span>
              {/* Share icons */}
            </p>
            <div className="blog-content-img">
              <img src={WorkImg1} alt="Blog Visual" />
            </div>
          </div>
        </div>

        <MagneticButton />
      </div>
    </div>
  );
}

export default Transition(SampleBlog);
