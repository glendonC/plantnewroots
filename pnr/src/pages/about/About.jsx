import React, { useEffect, useRef, useState } from 'react';
import './about.css';

import Transition from "../../components/transition/Transition";

import Faq from "react-faq-component";
import Marquee from "react-fast-marquee";
import MagneticButton from "../../components/magneticbutton/MagneticButton";

import PortraitImg from "../../assets/images/home/portrait.jpeg";

const About = () => {
  const data = {
    title: "",
    rows: [
      {
        title: "Who is this meant for?",
        content: "anyone and everyone! 😤😤😤",
      },
      {
        title: "Where did the name come from?",
        content: "i planted a carrot and thought of a metaphor to language learning",
      },
      {
        title: "Click me! 😉",
        content: "I love you and you should too! 🫶",
      },
    ],
  };

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

  const sectionTitles = ['Intro', 'Story', 'Vision', 'FAQ', 'Contact'];

  return (
    <div className="about page">
      <div className="container">
        <div className="map">
          {sectionTitles.map((title, i) => (
            <div ref={el => mapItems.current[i] = el} className={`s-${i + 1}`} key={i}>
              <p>{title}</p>
            </div>
          ))}
        </div>
        <div className="sections">
          <section ref={el => sections.current[0] = el} className="about-intro about-section">
            <h2>About Us</h2>
          </section>

          <section ref={el => sections.current[1] = el} className="about-intro-copy about-section">
            <div className="about-row">
              <div className="about-col">
                <p>
                  <span>Our Vision</span>
                </p>
              </div>
              <div className="about-col">
                <h3>
                  plant new roots began its development in April 2024 by glendon chin, a Korean/Chinese American who's currently writing this in the third person right now (so now i'll just switch to first person pov). put simply, learning a language (or multiple) will carry different meanings for each of us. as an example, i am currently studying korean right now and one of the goals that i am hellbent on reaching is being able to speak with my grandma whose first language isn't english. there's more to it, but i'll just leave it there for now. i knew it wouldn't be easy, but somewhere along the way i felt like with the growth of technology, we can create more intuitive resources to help us on our own language journeys :)
                </h3>
              </div>
            </div>
          </section>

          <section ref={el => sections.current[2] = el} className="about-portrait about-section">
            <div className="about-row">
              <div className="about-col">
              </div>
              <div className="about-col">
                <div className="about-portrait-img">
                  <img src={PortraitImg} alt="" />
                </div>
                <div className="faqs">
                  <Faq data={data} />
                </div>
              </div>
            </div>
          </section>

          <section ref={el => sections.current[3] = el} className="about-marquee about-section">
            <Marquee>
              <h1>Progress over Perfection.</h1>
            </Marquee>
          </section>

          <section ref={el => sections.current[4] = el} className="about-contact about-section">
            <div className="about-contact-copy">
              <h2>Is there something else that you want to see added?</h2>
              <p>
                <span>We want to hear your feedback! Message us @ plantnewroots@gmail.com!</span>
                <br></br>
                <span>(Hint: You can click the contact button at the button of the screen!)</span>
              </p>
              <br />
            </div>
          </section>

          <MagneticButton />

        </div>
      </div>
    </div>
  );
};

export default Transition(About);