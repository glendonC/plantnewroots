import React, { useEffect, useRef, useState } from "react";
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import "./menu.css";
import { gsap } from "gsap";

import DefaultPreviewImg from "../../assets/images/menu/default.jpg";
import LinkPreviewImg1 from "../../assets/images/home/portrait.jpeg";
import LinkPreviewImg2 from "../../assets/images/menu/analysis.jpg";
import LinkPreviewImg3 from "../../assets/images/menu/blog.jpg";
import LinkPreviewImg4 from "../../assets/images/menu/profile.jpg";
import LinkPreviewImg5 from "../../assets/images/menu/learn.jpg";

import MouseTrail from '../../components/mousetrail/MouseTrail';

const Menu = () => {
  const menuLinks = [
    { path: "/works", label: "Learn" },
    { path: "/analysispage", label: "Analysis"},
    { path: "/blog", label: "Blog" },
    { path: "/profile", label: "Profile" },
    { path: "/about", label: "About" },
  ];

  const menuContainer = useRef();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuAnimation = useRef();
  const menuLinksAnimation = useRef();
  const revealHoveredLinkImg = useRef();

  const { logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    document.querySelector(".hamburger-icon").classList.toggle("active");
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    if (isMenuOpen) {
      document.querySelector(".hamburger-icon").classList.toggle("active");
      setIsMenuOpen(false);
    } else return;
  };

  useEffect(() => {
    gsap.set(".menu-link-item-holder", { y: 125 });

    menuAnimation.current = gsap.timeline({ paused: true }).to(".menu", {
      duration: 1,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      ease: "power4.inOut",
    });

    menuLinksAnimation.current = gsap
      .timeline({ paused: true })
      .to(".menu-link-item-holder", {
        y: 0,
        duration: 1.25,
        stagger: 0.075,
        ease: "power3.inOut",
        delay: 0.125,
      });

    revealHoveredLinkImg.current = gsap
      .timeline({ paused: true })
      .to(".bind-new-img", {
        top: "0%",
        duration: 1,
        ease: "power.out",
      });
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      menuAnimation.current.play();
      menuLinksAnimation.current.play();
    } else {
      menuAnimation.current.reverse();
      menuLinksAnimation.current.reverse();
    }
  }, [isMenuOpen]);

  // handle link hover animation
  useEffect(() => {
    const previewContainer = document.querySelector(".link-preview-img");
    const menuLinkItems = document.querySelectorAll(".menu-link-item");
    const linkImages = [
      LinkPreviewImg1,
      LinkPreviewImg2,
      LinkPreviewImg3,
      LinkPreviewImg4,
      LinkPreviewImg5,
    ];

    let lastHoveredIndex = null;

    const handleMouseOver = (index) => {
      if (index !== lastHoveredIndex) {
        const imgContainer = document.createElement("div");
        imgContainer.classList.add("bind-new-img");
        const img = document.createElement("img");
        img.src = linkImages[index];
        img.alt = "";
        imgContainer.appendChild(img);
        previewContainer.appendChild(imgContainer);
    
        gsap.to(imgContainer, {
          top: "0%",
          left: "0%",
          duration: 1.25,
          ease: "power3.out",
          onComplete: () => {
            gsap.delayedCall(2, () => {
              const allImgContainers =
                previewContainer.querySelectorAll(".bind-new-img");
    
              if (allImgContainers.length > 1) {
                Array.from(allImgContainers)
                  .slice(0, -1)
                  .forEach((container) => {
                    setTimeout(() => {
                      container.remove();
                    }, 2000);
                  });
              }
            });
          },
        });
    
        lastHoveredIndex = index;
      }
    };
    

    menuLinkItems.forEach((item, index) => {
      item.addEventListener("mouseover", () => handleMouseOver(index));
    });

    return () => {
      menuLinkItems.forEach((item) => {
        item.removeEventListener("mouseover", () => handleMouseOver(index));
      });
    };
  }, []);

  const username = localStorage.getItem('username');
  
  return (
    <>
    <MouseTrail/>
    <div className="menu-container" ref={menuContainer}>
      <div className="menu-bar">
        <div className="menu-logo" onClick={closeMenu}>
          <Link to="/home">plant new roots</Link>
        </div>
        <div className="menu-actions">
          <div className="contact-btn">
            <div className="btn">
              <Link to="/profile">{username}</Link>
            </div>
          </div>
          <div className="logout-btn">
              <button onClick={handleLogout} className="btn">Logout</button>
            </div>
          <div className="menu-toggle">
            <button className="hamburger-icon" onClick={toggleMenu}></button>
          </div>
        </div>
      </div>
      
      <div className="menu">
        <div className="blob-container">
        <div className="link-preview-img preview-image" style={{ backgroundImage: `url(${DefaultPreviewImg})` }}>
            <img src={DefaultPreviewImg} alt="" />
            <div className="bind-new-img">
              <img src={LinkPreviewImg1} alt="" />
            </div>
          </div>
        </div>
        <div className="menu-col">
          <div className="menu-sub-col">
            <div className="menu-links">
              {menuLinks.map((link, index) => (
                <div
                  key={index}
                  className="menu-link-item"
                  onClick={toggleMenu}
                >
                  <div className="menu-link-item-holder">
                    <Link className="menu-link" to={link.path}>
                      {link.label}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
    
  );
};

export default Menu;
