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
        title: "What if I don't know what language I want to study?",
        content: "there's no harm in trying any of them and seeing what you like!",
      },
      {
        title: "How do I select the language that I want to study?",
        content: "You can set your target language and level in your profile!",
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
    const handleScroll = () => {
        const scrollPos = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        const adjustedHeight = Math.min(scrollPos, docHeight - windowHeight);

        const map = document.querySelector('.map');
        if (map) {
            map.style.top = `${Math.max(50, adjustedHeight)}px`;
        }

        const newActiveIndex = sections.current.findIndex((section, i) => {
            if (!mapItems.current[i]) return false;

            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionBottom = sectionTop + sectionHeight;
            const isInView = scrollPos >= sectionTop - windowHeight / 2 && scrollPos < sectionBottom - windowHeight / 2;

            if (isInView) {
                mapItems.current[i].style.height = 'calc(100vh - 100px)';
                mapItems.current[i].classList.add('active');
            } else {
                mapItems.current[i].style.height = '100px';
                mapItems.current[i].classList.remove('active');
            }
            return isInView;
        });

        setActiveIndex(newActiveIndex);
    };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sectionTitles = ['Story', 'Vision', 'FAQ'];

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
            <div className="about-col">
                <p>
                  <span>Our Story</span>
                </p>
              </div>
              <div className="about-col">
                <h3>
                  plant new roots began its development in April 2024 by glendon chin, a Korean/Chinese American who's currently writing this in the third person right now (so now i'll just switch to first person pov). put simply, learning a language (or multiple) will carry different meanings for each of us. as an example, i am currently studying korean right now and one of the goals that i so dearly want to reach is being able to speak with my grandma whose first language isn't english. there's more to it, but i'll just leave it there for now. i knew it wouldn't be easy, but somewhere along the way i felt like with the growth of technology, we can create more intuitive resources to help us on our own language journeys :)
                </h3>
              </div>
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
                  Reading, Writing, Listening, Speaking - we're basically training all four elements like the Avatar now that I think about it. The goal is to provide the resources for everyone to practice their target language in each category because we all have our own weaknesses when it comes to practicing certain modules. I am no exception to this as I find myself struggling to speak Korean and have often fell back on purely memorizing words and grammar points. In the future, I hope to implement sub-like modules into each of these to enable a greater experience such as vocabulary studying, pronunciation practice, etc. Moreover, I want to make plant new roots a platform not just designated for learning languages, but finding meaning through that journey and open everyone up to learning more about the culture(s) associated with them.
                </h3>
              </div>
            </div>
          </section>

          <section ref={el => sections.current[2] = el} className="about-portrait about-section">
            <div className="about-row">
              <div className="about-col">
                <div className="about-portrait-img">
                  <img src={PortraitImg} alt="Portrait of Glendon Chin" />
                </div>
              </div>
              <div className="about-col">
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