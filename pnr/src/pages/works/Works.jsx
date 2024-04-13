import React, { useRef, useEffect } from "react";
import "./works.css";

import Transition from "../../components/transition/Transition";
import { Link } from "react-router-dom";

import Marquee from "react-fast-marquee";
import MagneticButton from "../../components/magneticbutton/MagneticButton";
import { gsap } from "gsap";

import WorkImg1 from "../../assets/images/work/reading.jpg";
import WorkImg2 from "../../assets/images/work/writing.jpg";
import WorkImg3 from "../../assets/images/work/listening.jpg";
import WorkImg4 from "../../assets/images/work/speaking.jpg";
import WorkImg5 from "../../assets/images/work/community.jpg";

const Works = () => {
  const workCopyReveal = useRef();

  let lastHoveredIndex = null;

  const handleResetPreivew = () => {
    gsap.to(".project-preview img", {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        lastHoveredIndex = -1;
      },
    });
  };
  useEffect(() => {
    workCopyReveal.current = gsap.timeline({ paused: true }).to("h1", {
      top: "0",
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
      delay: 0.35,
    });

    workCopyReveal.current.play();
  }, []);

  const workPreviewImages = [
    WorkImg1,
    WorkImg2,
    WorkImg3,
    WorkImg4,
  ];

  const handleMouseOver = (index) => {
    const projectPreviewContainer = document.querySelector(".project-preview");

    if (index !== lastHoveredIndex) {
      console.log(`Hovered ${index}`);

      const img = document.createElement("img");
      img.src = workPreviewImages[index - 1];
      projectPreviewContainer.appendChild(img);

      gsap.to(img, {
        opacity: 1,
        duration: 0.3,
        onComplete: () => {
          const allPrevImages = projectPreviewContainer.querySelectorAll("img");

          if (allPrevImages.length > 1) {
            Array.from(allPrevImages)
              .slice(0, -1)
              .forEach((img) => {
                setTimeout(() => {
                  img.remove();
                }, 1000);
              });
          }
        },
      });

      lastHoveredIndex = index;
    }
  };

  useEffect(() => {
    const projectItems = document.querySelectorAll(".project-item");

    return () => {
      projectItems.forEach((projectItem) => {
        projectItem.removeEventListener("mouseover", () =>
          handleMouseOver(index)
        );
      });
    };
  }, []);

  return (
    <div className="works page">
      <div className="project-preview"></div>
      <div className="container">
        <section
          className="works-hero"
          onMouseOver={() => {
            handleResetPreivew();
          }}
        >
          <div className="work-copy-wrapper">
            <h1>Learn through Trying</h1>
          </div>
        </section>

        

        <section className="project-list">

        <div className="project-list-row">
            <div className="project-list-col">
              <div
                className="project-item"
                onMouseOver={() => handleMouseOver(1)}
              >
                <div className="project-img">
                  <Link to="/reading">
                    <img src={WorkImg1} alt="" />
                  </Link>
                </div>
                <div className="project-copy copy-pos-right">
                  <h2>Reading Conversation</h2>
                </div>
              </div>
            </div>
            <div className="project-list-col whitespace-col"></div>
          </div>

          <div className="project-list-row">
            <div className="project-list-col whitespace-col"></div>
            <div className="project-list-col">
              <div
                className="project-item"
                onMouseOver={() => handleMouseOver(2)}
              >
                <div className="project-img">
                  <Link to="/conversationchoices">
                    <img src={WorkImg2} alt="" />
                  </Link>
                </div>
                <div className="project-copy copy-pos-left">
                  <h2>Writing Conversation</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="project-list-row">
            <div className="project-list-col">
              <div
                className="project-item"
                onMouseOver={() => handleMouseOver(1)}
              >
                <div className="project-img">
                  <Link to="/conversationchoices">
                    <img src={WorkImg3} alt="" />
                  </Link>
                </div>
                <div className="project-copy copy-pos-right">
                  <h2>Listening Conversation</h2>
                </div>
              </div>
            </div>
            <div className="project-list-col whitespace-col"></div>
          </div>


          <div className="project-list-row">
            <div className="project-list-col whitespace-col"></div>
            <div className="project-list-col">
              <div
                className="project-item"
                onMouseOver={() => handleMouseOver(2)}
              >
                <div className="project-img">
                  <Link to="/conversationchoices">
                    <img src={WorkImg4} alt="" />
                  </Link>
                </div>
                <div className="project-copy copy-pos-left">
                  <h2>Speaking Conversation</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="project-list-row">
            <div className="project-list-col">
              <div
                className="project-item"
                onMouseOver={() => handleMouseOver(3)}
              >
                <div className="project-img">
                  <Link to="/analysispage">
                    <img src={WorkImg5} alt="" />
                  </Link>
                </div>
                <div className="project-copy copy-pos-right">
                  <h2>Analysis</h2>
                </div>
              </div>
            </div>
            <div className="project-list-col whitespace-col"></div>
          </div>

          {/* <div className="project-list-row">
            <div className="project-list-col whitespace-col"></div>
            <div className="project-list-col">
              <div
                className="project-item"
                onMouseOver={() => handleMouseOver(4)}
              >
                <div className="project-img">
                  <Link to="/analysisreport">
                    <img src={WorkImg5} alt="" />
                  </Link>
                </div>
                <div className="project-copy copy-pos-left">
                  <h2>Collage</h2>
                </div>
              </div>
            </div>
          </div> */}

        </section>

        <div
          className="works-marquee"
          onMouseOver={() => {
            handleResetPreivew();
          }}
        >
          <Marquee>
            <h1>
            The limits of my language mean the limits of my world. 
            </h1>
          </Marquee>
        </div>

        <div
          className="magnetic-btn"
          onMouseOver={() => {
            handleResetPreivew();
          }}
        >
          <MagneticButton />
        </div>
      </div>
    </div>
  );
};

export default Transition(Works);
