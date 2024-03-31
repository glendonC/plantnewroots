import React from "react";
import "./about.css";

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
        title: "Who is PNR meant for?",
        content:
          "test",
      },
      {
        title: "Where did the name PNR come from?",
        content:
          "test",
      },
      {
        title: "How can I trust the AI's own accuracy?",
        content:
          "test",
      },
    ],
  };

  return (
    <div className="about page">
      <div className="container">
        <section className="about-marquee">
          <Marquee>
            <h1>
              Progress over Perfection.
            </h1>
          </Marquee>
        </section>

        <section className="about-intro">
          <h2>
            random intro text
          </h2>
        </section>

        <section className="about-intro-copy">
          <div className="about-row">
            <div className="about-col">
              <p>
                <span>Est. 2024</span>
              </p>
            </div>
            <div className="about-col">
              <h3>
                first paragraph about text
              </h3>
              <h3 style={{ textIndent: "100px" }}>
                second paragraph about text
              </h3>
            </div>
          </div>
        </section>

        <section className="about-portrait">
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

        <section className="about-contact">
          <div className="about-contact-copy">
            <h2>Any suggestions?</h2>
            <p>
              <span>
                We want to hear your feedback! Message us @ plantnewroots@gmail.com!
              </span>
            </p>

            <br />
            <p>
              <span>+1 I-Luv-Learning</span>
            </p>
            {/* <p>
              <span>Instagram • Twitter</span>
            </p> */}
          </div>
        </section>

        <MagneticButton />
      </div>
    </div>
  );
};

export default Transition(About);
