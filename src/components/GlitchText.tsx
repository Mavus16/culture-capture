'use client';

import { useState, useEffect } from 'react';

export function GlitchText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const chars = '!<>-_\\\\/[]{}—=+*^?#________';

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const animate = () => {
      let iteration = 0;
      const interval = setInterval(() => {
        setDisplayedText((prev) => 
          text
            .split('')
            .map((letter, index) => {
              if (index < iteration) {
                return text[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('')
        );
        
        if (iteration >= text.length) {
          clearInterval(interval);
        }
        
        iteration += 1 / 3;
      }, 30);
      
      return interval;
    };

    if (delay > 0) {
      timeoutId = setTimeout(() => {
        const interval = animate();
        // Just storing the interval locally for cleanup, though it will complete
      }, delay);
    } else {
      animate();
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [text, delay]);

  return <span>{displayedText}</span>;
}
