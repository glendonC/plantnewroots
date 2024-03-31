import React from "react";
import Transition from "../../components/transition/Transition";

import WorkImg1 from "../../assets/images/work/writing.jpg";
import { InstagramLogo, MetaLogo, XLogo, MediumLogo } from "@phosphor-icons/react";

import MagneticButton from "../../components/magneticbutton/MagneticButton";

import "./sample-blog.css";

function SampleBlog() {
  return (
    <div className="sample-blog page">
      <div className="container">
        <div className="s-blog-hero">
          <h2>Story Title Content</h2>
        </div>

        <div className="blog-content">
          <div className="s-blog-col scroll">
            <p>
              <span>Story Subject Area and Date</span>
            </p>

            <br />
            <h4>
              Introduction, engaging text.
            </h4>
            <br />
            <br />
            <p>
              Further, deep explanation.
            </p>
            <br />
            <br />
            <h3>
              Build up content.
            </h3>
            <p>
              More explanation.
            </p>
            <br />
            <br />
            <p>
              More explanation.
            </p>
            <br />
            <br />
            <p>
              More explanation.
            </p>
            <br />
            <br />
            <p>
              More explanation.
            </p>
            <br />
            <br />
            <p>
            More explanation.
            </p>
            <br />
            <br />
          </div>
          <div className="s-blog-col sticky">
            <p id="blog-share">
              <span>Share</span>{" "}
              <div className="share-icon">
                <MediumLogo size={18} weight="light" color="#fff" />
              </div>
              <div className="share-icon">
                <InstagramLogo size={18} weight="light" color="#fff" />
              </div>
              <div className="share-icon">
                <MetaLogo size={18} weight="light" color="#fff" />
              </div>
              <div className="share-icon">
                <XLogo size={18} weight="light" color="#fff" />
              </div>
            </p>

            <div className="blog-content-img">
              <img src={WorkImg1} alt="" />
            </div>
          </div>
        </div>

        <MagneticButton />
      </div>
    </div>
  );
}

export default Transition(SampleBlog);
