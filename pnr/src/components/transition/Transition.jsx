import React from "react";
import { motion } from "framer-motion";

import "./transition.css";

const Transition = (OgPage) => {
  return function WithTransition(props) {
    return (
      <>
        <OgPage {...props} />
        <motion.div
          className="slide-in"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 1 }}
          transition={{ duration: 0.75, ease: [0.83, 0, 0.17, 1] }}
        />
        <motion.div
          className="slide-out"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.75, ease: [0.83, 0, 0.17, 1] }}
        />
      </>
    );
  };
};

export default Transition;
