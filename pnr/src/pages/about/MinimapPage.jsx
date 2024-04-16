import React, { useEffect, useRef, useState } from 'react';
import './MinimapPage.css';

const MinimapPage = () => {
  const mapItems = useRef([]);
  const sections = useRef([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const sectionHeights = sections.current.map(section => section.clientHeight * 0.5);
    const accumulatedHeights = sectionHeights.reduce((acc, height, i) => {
      acc.push((acc[i - 1] || 0) + sections.current[i].clientHeight);
      return acc;
    }, []);

    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const newActiveIndex = accumulatedHeights.findIndex((height, i) => scrollPos < height && (i === 0 || scrollPos >= accumulatedHeights[i - 1]));

      if (newActiveIndex !== activeIndex) {
        if (activeIndex !== -1) mapItems.current[activeIndex].style.height = '100px';
        mapItems.current[newActiveIndex].style.height = `${sectionHeights[newActiveIndex]}px`;
        setActiveIndex(newActiveIndex);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeIndex]);

  return (
    <div className="minimap-page-container">
      <div className="map">
        {Array.from({ length: 8 }, (_, i) => (
          <div ref={el => mapItems.current[i] = el} className={`s-${i + 1}`} key={i}>
            <p>{`0${i + 1}`}</p>
            <p>{['Raw Materials', 'Hello', 'Approach', 'Work', 'Talent', 'Careers', 'Contact', 'Unusual Index'][i]}</p>
          </div>
        ))}
      </div>
      <div className="sections">
        {['Raw Materials', 'Hello', 'Approach', 'Work', 'Talent', 'Careers', 'Contact', 'Unusual Index'].map((title, i) => (
          <div ref={el => sections.current[i] = el} className={`section-${i + 1} sec`} key={i}>
            <div className="header">
              <p>{`0${i + 1}`}</p>
              <p>{title}</p>
            </div>
            <div className="copy">
              <h1>Description for {title}</h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MinimapPage;
