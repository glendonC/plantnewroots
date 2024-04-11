import React, { useEffect } from 'react';
import gsap from 'gsap';
import './MouseTrail.css';

const MouseTrail = () => {
  useEffect(() => {
    const trails = document.querySelectorAll('.trail');
    const smoothPointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const totalPointsArray = [40, 35, 30, 25, 20, 15, 10];

    window.addEventListener('mousemove', (event) => {
      gsap.to(smoothPointer, {
        x: event.clientX,
        y: event.clientY,
        duration: 0.5,
        ease: 'power2.out',
      });
    });

    const updatePath = () => {
      trails.forEach((path, index) => {
        let points = path.points || [];
        points.unshift({ ...smoothPointer });
        while (points.length > totalPointsArray[index]) {
          points.pop();
        }
        path.points = points;

        if (points.length > 1) {
          let d = `M ${points[0].x} ${points[0].y}`;
          for (let i = 1; i < points.length; i++) {
            d += ` L ${points[i].x} ${points[i].y}`;
          }
          path.setAttribute('d', d);
        }
      });

      requestAnimationFrame(updatePath);
    };

    updatePath();
  }, []);

  return (
    <div className="mouse-trail-wrapper">
      {Array(7).fill().map((_, index) => (
        <svg key={index}><path d="" className="trail" style={{ stroke: `hsl(${index * 60}, 100%, 50%)` }}></path></svg>
      ))}
    </div>
  );
};

export default MouseTrail;
