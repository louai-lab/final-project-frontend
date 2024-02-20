import React from 'react';
import { useSpring, animated } from 'react-spring';
import StyleLoader from './FootballLoader.module.css';

const FootballLoader = () => {
  const props = useSpring({
    loop: true,
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  });

  return (
    <div className={StyleLoader.centerContainer}>
      <animated.div className={StyleLoader.football} style={props} />
      <h1>Loading...</h1>
    </div>
  );
};

export default FootballLoader;
