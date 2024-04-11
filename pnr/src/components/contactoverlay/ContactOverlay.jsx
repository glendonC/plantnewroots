import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import './ContactOverlay.css';

const ContactOverlay = ({ isOpen, setIsOpen }) => {
    useEffect(() => {
        const timeline = gsap.timeline({ paused: true })
          .to(".contact-overlay", { opacity: 1, duration: 0.3, pointerEvents: "all" });
    
        timeline.fromTo(".contact-overlay-content", { opacity: 0 }, { opacity: 1, duration: 0.5 });
      
        if (isOpen) {
          timeline.play();
        } else {
          timeline.reverse();
        }
      }, [isOpen]);
      
      const closeOverlay = () => {
        document.querySelector(".contact-overlay").style.opacity = '0';
        document.querySelector(".contact-overlay").style.pointerEvents = 'none';
        setIsOpen(false);
      };
      

  return (
    <div className="contact-overlay" style={{ opacity: 0, pointerEvents: "none" }}>
      <div className="contact-overlay-content">
        <div className="contact-overlay-form">
        <div className="contact-overlay-about">
          <p>
            <h2>Contact Us</h2>
            We'd love to hear your thoughts!
          </p>
        </div>
          <form>
            <label htmlFor="fname">Name</label><br />
            <input type="text" id="fname" name="fname" placeholder="first + surname"/><br /><br />

            <label htmlFor="lname">Location</label><br />
            <input type="text" id="lname" name="lname" placeholder="i.e. united states"/><br /><br />

            <label htmlFor="content">Content</label><br />
            <input type="text" id="content" name="content" placeholder="please just pay for my personal tutor -_-"/><br /><br />
            <button type="submit">Send Message</button>
          </form>
        </div>

        <div className="contact-overlay-back" onClick={closeOverlay}>[ back ]</div>
      </div>
    </div>
  );
};

export default ContactOverlay;
