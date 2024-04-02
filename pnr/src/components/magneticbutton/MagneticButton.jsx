import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import "./MagneticButton.css";

import { useAuth } from '../../contexts/AuthContext';

import gsap from "gsap";

const MagneticButton = () => {
  const btnRef = useRef(null);
  const textRef = useRef(null);
  const wrapperRef = useRef(null);

  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const btn = btnRef.current;
    const text = textRef.current;

    if (!wrapper || !btn || !text) return;

    const moveEvent = (e) => {
      const wrapperRect = wrapper.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();

      const relX = e.clientX - (wrapperRect.left + wrapperRect.width / 2);
      const relY = e.clientY - (wrapperRect.top + wrapperRect.height / 2);

      const btnMaxDisplacement = 50;
      const textMaxDisplacement = 60;

      const btnDisplacementX = (relX / wrapperRect.width) * btnMaxDisplacement;
      const btnDisplacementY = (relY / wrapperRect.height) * btnMaxDisplacement;
      const textDisplacementX =
        (relX / wrapperRect.width) * textMaxDisplacement;
      const textDisplacementY =
        (relY / wrapperRect.height) * textMaxDisplacement;

      gsap.to(btn, {
        x: btnDisplacementX,
        y: btnDisplacementY,
        ease: "power3.out",
        duration: 0.35,
      });

      gsap.to(text, {
        x: textDisplacementX,
        y: textDisplacementY,
        ease: "power3.out",
        duration: 0.35,
      });
    };

    const leaveEvent = () => {
      gsap.to([btn, text], {
        x: 0,
        y: 0,
        ease: "power3.out",
        duration: 1,
      });
    };

    wrapper.addEventListener("mousemove", moveEvent);
    wrapper.addEventListener("mouseleave", leaveEvent);

    return () => {
      wrapper.removeEventListener("mousemove", moveEvent);
      wrapper.removeEventListener("mouseleave", leaveEvent);
    };
  }, []);

  return (
    <div className="m-btn-wrapper" ref={wrapperRef}>
      <Link to={isLoggedIn ? "/home" : "/login"}>
      <div className="m-btn" ref={btnRef}>
          <div className="arrow-right">
            <img
              src="https://assets-global.website-files.com/61385c793ab59f1f6a3372f7/613b078390142aafe0cdc267_arrow-next_white.svg"
              alt=""
            />
          </div>
          <div className="m-btn-copy">
            <p ref={textRef}>
              {" "}
              Return <br /> Home
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MagneticButton;
