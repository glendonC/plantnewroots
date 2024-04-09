import React from "react";
import Transition from "../../components/transition/Transition";

import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";

import MagneticButton from "../../components/magneticbutton/MagneticButton";
import { useLevel } from "../../contexts/LevelContext";
import { useTargetLanguage } from "../../contexts/TargetLanguageContext";
import "./blog.css";

const Blog = () => {
  const { selectedLevel } = useLevel();
  const { selectedLanguage } = useTargetLanguage();

  return (
    <div className="blog page">
      <div className="container">
        <div className="blog-hero">
        <h1>
            Curated {selectedLanguage || "Select a level"} content for <span>you</span> - <span>{selectedLevel || "Select a level"}</span>
          </h1>
        </div>

        <section className="blogs">
          <div className="blog-row">
            <div className="blog-col">
              <div className="blog-item">
                <div className="blog-divider">
                  <div className="b-div-1"></div>
                  <div className="b-div-2"></div>
                </div>

                <div className="blog-title-wrapper">
                  <div className="blog-title">
                    <h3>
                      <Link to="/sample-blog">
                        Story 1
                      </Link>
                    </h3>
                    <p>
                      <span>Story 1 Subtitle</span>
                    </p>
                  </div>

                  <div className="blog-arrow">
                    <ArrowRight size={32} weight="light" color="#fff" />
                  </div>
                </div>
              </div>
            </div>
            <div className="blog-col">
              <div className="blog-item">
                <div className="blog-divider">
                  <div className="b-div-1"></div>
                  <div className="b-div-2"></div>
                </div>

                <div className="blog-title-wrapper">
                  <div className="blog-title">
                    <h3>
                      <Link to="/sample-blog">
                      Story 2
                      </Link>
                    </h3>
                    <p>
                      <span>Story 2 Subtitle</span>
                    </p>
                  </div>

                  <div className="blog-arrow">
                    <ArrowRight size={32} weight="light" color="#fff" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="blog-row">
            <div className="blog-col">
              <div className="blog-item">
                <div className="blog-divider">
                  <div className="b-div-1"></div>
                  <div className="b-div-2"></div>
                </div>

                <div className="blog-title-wrapper">
                  <div className="blog-title">
                    <h3>
                      <Link to="/sample-blog">
                      Story 3
                      </Link>
                    </h3>
                    <p>
                      <span>Story 3 Subtitle</span>
                    </p>
                  </div>

                  <div className="blog-arrow">
                    <ArrowRight size={32} weight="light" color="#fff" />
                  </div>
                </div>
              </div>
            </div>
            <div className="blog-col">
              <div className="blog-item">
                <div className="blog-divider">
                  <div className="b-div-1"></div>
                  <div className="b-div-2"></div>
                </div>

                <div className="blog-title-wrapper">
                  <div className="blog-title">
                    <h3>
                      <Link to="/sample-blog">
                      Story 4
                      </Link>
                    </h3>
                    <p>
                      <span>Story 4 Subtitle</span>
                    </p>
                  </div>

                  <div className="blog-arrow">
                    <ArrowRight size={32} weight="light" color="#fff" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="blog-row">
            <div className="blog-col">
              <div className="blog-item">
                <div className="blog-divider">
                  <div className="b-div-1"></div>
                  <div className="b-div-2"></div>
                </div>

                <div className="blog-title-wrapper">
                  <div className="blog-title">
                    <h3>
                      <Link to="/sample-blog">
                      Story 5
                      </Link>
                    </h3>
                    <p>
                      <span>Story 5 Subtitle</span>
                    </p>
                  </div>

                  <div className="blog-arrow">
                    <ArrowRight size={32} weight="light" color="#fff" />
                  </div>
                </div>
              </div>
            </div>
            <div className="blog-col">
              <div className="blog-item">
                <div className="blog-divider">
                  <div className="b-div-1"></div>
                  <div className="b-div-2"></div>
                </div>

                <div className="blog-title-wrapper">
                  <div className="blog-title">
                    <h3>
                      <Link to="/sample-blog">
                      Story 6
                      </Link>
                    </h3>
                    <p>
                      <span>Story 6 Subtitle</span>
                    </p>
                  </div>

                  <div className="blog-arrow">
                    <ArrowRight size={32} weight="light" color="#fff" />
                  </div>
                </div>
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

export default Transition(Blog);
