import React from 'react';
import { motion } from 'framer-motion';

const spring = {
  type: 'spring',
  stiffness: 700,
  damping: 30
};

const AnimatedToggle = ({ isOn, handleToggle }) => {
  return (
    <div className={`switch ${isOn ? 'on' : 'off'}`} onClick={handleToggle}>
      <motion.div className="handle" layout transition={spring} />
    </div>
  );
};

export default AnimatedToggle;
