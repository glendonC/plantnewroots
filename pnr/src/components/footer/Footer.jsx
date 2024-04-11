import React, { useState } from 'react';
import ContactOverlay from '../contactoverlay/ContactOverlay';
import "./footer.css";

const Footer = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  return (
    <>
      <ContactOverlay isOpen={isOverlayOpen} setIsOpen={setIsOverlayOpen} />
      <div className="footer">
        <div className="container">
          <div className="footer-col">
            <div className="footer-item">
              <a href="#" onClick={(e) => {
                e.preventDefault();
                setIsOverlayOpen(true);
              }}>Contact</a>
            </div>
          </div>
          <div className="footer-col">
          <div className="footer-item">
            <a href="#">Est. Apr 2024</a>
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
