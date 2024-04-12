import React, { useEffect, useState } from "react";
import { useStory } from "../../contexts/StoryContext";
import { useParams, useLocation } from "react-router-dom";
import Transition from "../../components/transition/Transition";
import WorkImg1 from "../../assets/images/work/writing.jpg";
import MagneticButton from "../../components/magneticbutton/MagneticButton";
import "./sample-blog.css";
import { NotionLogo, GoogleLogo } from "@phosphor-icons/react";
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
      const levelDescriptor = selectedLevel;

      switch (title.toLowerCase()) {
        case "learning new words":
          prompt = `Generate 5 ${levelDescriptor} words and an example of each being used in context in ${selectedLanguage}.`;
          break;
        case "learning new grammar":
          prompt = `Generate 5 ${levelDescriptor} grammar points with their explanations and an example of each being used in context in ${selectedLanguage}.`;
          break;
        case "exploring culture":
          prompt = `Generate a brief 5-10 sentence post about some part of the language relating to the culture to enhance the user's perspective on the culture in ${selectedLanguage} and then its translation in English if ${selectedLanguage} isn't already English.`;
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
          <h2>{title || "Default Title"}</h2>
        </div>
  
        <div className="blog-content">
          <div className="s-blog-col scroll">
            <p><span>{subtitle || "Default Subtitle"}</span></p>
            <br />
            {content.split('\n\n').map((paragraph, index) => (
              <React.Fragment key={index}>
                <p>{paragraph}</p>
                <br /><br />
              </React.Fragment>
            ))}
  
          </div>
          <div className="s-blog-col sticky">
            <p id="blog-share">
              <span>Save Notes!</span>
              <div className="share-icon">
                <GoogleLogo size={18} weight="light" color="#fff" />
              </div>
              <div className="share-icon">
                <NotionLogo size={18} weight="light" color="#fff" />
              </div>
            </p>
  
            <div className="blog-content-img">
              <img src={WorkImg1} alt="Visual representation related to the blog" />
            </div>
          </div>
        </div>
  
        <MagneticButton />
      </div>
    </div>
  );
  

}

export default Transition(SampleBlog);
