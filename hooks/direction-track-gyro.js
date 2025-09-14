import { useEffect, useRef } from 'react';
import { sendDirectionalAction } from '../utils/sendActionMsg';

export const useDirectionalInput = (controlledDotPos, width, height, setDirection) => {
  const prevDir = useRef({ vertical: 'Neutral', horizontal: 'Neutral' });

  const classifyPosition = (x, y) => {
    const centerX = width / 2;
    const centerY = height / 2;

   // Scale thresholds relative to container size
    const thresholdX = width * 0.2;   // 20% of width
    const thresholdY = height * 0.2;  // 20% of height

    let vertical = 'Neutral';
    let horizontal = 'Neutral';

    if (y < centerY - thresholdY) vertical = 'Up';
    else if (y > centerY + thresholdY) vertical = 'Down';

    if (x < centerX - thresholdX) horizontal = 'Left';
    else if (x > centerX + thresholdX) horizontal = 'Right';

    return { vertical, horizontal };
  };

  useEffect(() => {
    const { vertical, horizontal } = classifyPosition(controlledDotPos.x, controlledDotPos.y);

    // Handle vertical direction changes
    if (vertical !== prevDir.current.vertical) {
      if (prevDir.current.vertical !== 'Neutral') {
        sendDirectionalAction(prevDir.current.vertical, 'up');
        console.log(`${prevDir.current.vertical}_up`);
      }
      if (vertical !== 'Neutral') {
        sendDirectionalAction(vertical, 'down');
        console.log(`${vertical}_down`);
      }
    }

    // Handle horizontal direction changes
    if (horizontal !== prevDir.current.horizontal) {
      if (prevDir.current.horizontal !== 'Neutral') {
        sendDirectionalAction(prevDir.current.horizontal, 'up');
        console.log(`${prevDir.current.horizontal}_up`);
      }
      if (horizontal !== 'Neutral') {
        sendDirectionalAction(horizontal, 'down');
        console.log(`${horizontal}_down`);
      }
    }

    // Optionally update external direction state
    if (setDirection) {
      setDirection({ vertical, horizontal });
    }

    // Save for next comparison
    prevDir.current = { vertical, horizontal };
  }, [controlledDotPos,width,height]);

   //function to release all directions
  const releaseAllDirections = () => {
    ['Up', 'Down', 'Left', 'Right'].forEach(dir => {
      sendDirectionalAction(dir, 'up');
      console.log(`${dir}_up`);
    });
    prevDir.current = { vertical: 'Neutral', horizontal: 'Neutral' };
  };

  return { releaseAllDirections };

};

