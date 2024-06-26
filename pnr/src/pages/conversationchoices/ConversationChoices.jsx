import React, { useState, useEffect, useRef } from "react";

import Transition from "../../components/transition/Transition";
import { ArrowRight } from "@phosphor-icons/react";
import prev1 from './casualconvo.gif';
import prev2 from './professionalconvo.gif';
import prev3 from './culturalexchange.gif';

import { useNavigate } from 'react-router-dom';
import "./conversationchoices.css";

const ConversationChoices = () => {

  const [activePreview, setActivePreview] = useState('prev-2');
  const [workClass, setWorkClass] = useState('work');
  const [overlayPosition, setOverlayPosition] = useState({ top: '0%', left: '13.25%' });

  const navigate = useNavigate();

  const handleMouseOver = (index) => {
    setActivePreview(`prev-${index + 1}`);
    const positions = [
        { top: '50%', left: '50%', className: 'work bg-color-red hovered' },
        { top: '0%', left: '13.25%', className: 'work bg-color-blue hovered' },
        { top: '-50%', left: '-23.5%', className: 'work bg-color-green hovered' },
    ];

    const { top, left, className } = positions[index];
    setOverlayPosition({ top, left });

    document.body.style.backgroundColor = className.split(' ')[2];
    positions.forEach(position => {
        const prevClassName = position.className.split(' ')[2];
        if (prevClassName !== className.split(' ')[2]) {
            document.body.classList.remove(prevClassName);
        }
    });

    setWorkClass(className);
};


const handleMouseOut = () => {
  setActivePreview('prev-2');
  setWorkClass('work');
  setOverlayPosition({ top: '0%', left: '13.25%' });
  document.body.style.backgroundColor = '';
};
useEffect(() => {
  return () => {
      document.body.style.backgroundColor = '';
  };
}, []);

  const navigateToConversation = (path) => {
    navigate(path);
  };

  return (


        <>

<div className="project page">


      <div className="container">
        <section className="project-title">
          <h1>Conversation Practice</h1>
        </section>
        
        </div>
    </div>

    <div className="conversationchoices">
      <div className={`work ${workClass}`}>
        <div className="overlay" style={{ top: overlayPosition.top, left: overlayPosition.left }}>
          <div className={`prev${activePreview === 'prev-1' ? ' active' : ''}`} id="prev-1">
            <img src={prev1} alt="" />
          </div>
          <div className={`prev${activePreview === 'prev-2' ? ' active' : ''}`} id="prev-2">
            <img src={prev2} alt="" />
          </div>
          <div className={`prev${activePreview === 'prev-3' ? ' active' : ''}`} id="prev-3">
            <img src={prev3} alt="" />
          </div>
        </div>

        <div className="work-item" onClick={() => navigateToConversation('/daily')} onMouseOver={() => handleMouseOver(0)} onMouseOut={handleMouseOut}>
        <div className="work-item-name">
          <h1>Daily</h1>
        </div>
        <div className="work-item-icon">
        <div className="icon-holder i-1">
            <ArrowRight />
          </div>
          <div className="icon-holder i-2">
          <ArrowRight />
          </div>
        </div>
      </div>
      <div className="work-item" onClick={() => navigateToConversation('/professional')} onMouseOver={() => handleMouseOver(1)} onMouseOut={handleMouseOut}>
        <div className="work-item-name">
          <h1>Professional / Academic</h1>
        </div>
        <div className="work-item-icon">
          <div className="icon-holder i-1">
            <ArrowRight />
          </div>
          <div className="icon-holder i-2">
            <ArrowRight />
          </div>
        </div>
      </div>
      <div className="work-item" onClick={() => navigateToConversation('/cultural')} onMouseOver={() => handleMouseOver(2)} onMouseOut={handleMouseOut}>
        <div className="work-item-name">
          <h1>Cultural Exchange</h1>
        </div>
        <div className="work-item-icon">
          <div className="icon-holder i-1">
            <ArrowRight />
          </div>
          <div className="icon-holder i-2">
            <ArrowRight />
          </div>
        </div>
      </div>
    </div>
  </div>
</>

       
  );
  
};

export default Transition(ConversationChoices);