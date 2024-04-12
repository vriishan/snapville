import React, { useEffect } from 'react';
import './Background.css';

const NUM_BUBBLES = 7; // Number of bubbles

const Background = () => {
  useEffect(() => {
    const bubbles = document.querySelectorAll('.bubble');

    bubbles.forEach(bubble => {
      // Set random initial position within the viewport
      bubble.style.top = `${Math.random() * window.innerHeight}px`;
      bubble.style.left = `${Math.random() * window.innerWidth}px`;

      // Set random initial velocity with adjusted speed
      const speed = Math.random() * 0.3 + 0.2; // Random speed between 0.2 and 0.5
      const angle = Math.random() * 360; // Random angle in degrees
      const velocityX = Math.cos(angle) * speed;
      const velocityY = Math.sin(angle) * speed;
      bubble.dataset.velocityX = velocityX;
      bubble.dataset.velocityY = velocityY;
    });

    const moveBubbles = () => {
      bubbles.forEach(bubble => {
        let x = parseFloat(bubble.style.left);
        let y = parseFloat(bubble.style.top);
        let velocityX = parseFloat(bubble.dataset.velocityX);
        let velocityY = parseFloat(bubble.dataset.velocityY);

        // Update position
        x += velocityX;
        y += velocityY;

        // Reverse direction if bubble hits the edge
        if (x <= 0 || x >= window.innerWidth) {
          velocityX *= -1;
        }
        if (y <= 0 || y >= window.innerHeight) {
          velocityY *= -1;
        }

        // Update bubble position
        bubble.style.left = `${x}px`;
        bubble.style.top = `${y}px`;
        bubble.dataset.velocityX = velocityX;
        bubble.dataset.velocityY = velocityY;
      });

      // Check for collisions
      for (let i = 0; i < bubbles.length; i++) {
        for (let j = i + 1; j < bubbles.length; j++) {
          const bubble1 = bubbles[i];
          const bubble2 = bubbles[j];
          const rect1 = bubble1.getBoundingClientRect();
          const rect2 = bubble2.getBoundingClientRect();

          if (
            rect1.left < rect2.right &&
            rect1.right > rect2.left &&
            rect1.top < rect2.bottom &&
            rect1.bottom > rect2.top
          ) {
            // Collision detected, reverse velocities
            let tempVelocityX = bubble1.dataset.velocityX;
            let tempVelocityY = bubble1.dataset.velocityY;
            bubble1.dataset.velocityX = bubble2.dataset.velocityX;
            bubble1.dataset.velocityY = bubble2.dataset.velocityY;
            bubble2.dataset.velocityX = tempVelocityX;
            bubble2.dataset.velocityY = tempVelocityY;
          }
        }
      }

      requestAnimationFrame(moveBubbles);
    };

    moveBubbles();

    // Clean up event listeners
    return () => {
      cancelAnimationFrame(moveBubbles);
    };
  }, []);

  return (
    <div className="background">
      {Array.from({ length: NUM_BUBBLES }).map((_, index) => (
        <div className={`bubble bubble${index + 1}`} key={index}></div>
      ))}
    </div>
  );
};

export default Background;
