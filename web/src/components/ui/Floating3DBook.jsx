import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assetPath } from '../../utils/assetPath';

export const Floating3DBook = ({
  imageSrc = '/assets/marketing/soe-album-storybook-cover.webp',
  altText = 'The Sound of Essentials Rhythm Quest Storybook & Album Cover',
  badgeText = '📖 Storybook Gallery • Click to Explore',
  to = '/gallery',
}) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [shinePos, setShinePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const { left, top, width, height } = card.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Calculate rotation angles (up to 16 deg on X/Y)
    const rotateX = ((y - height / 2) / height) * -16;
    const rotateY = ((x - width / 2) / width) * 16;

    // Apply 3D transform with depth and subtle scale
    card.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.04, 1.04, 1.04)`;

    // Calculate dynamic specular glare position
    const shineX = (x / width) * 100;
    const shineY = (y / height) * 100;
    setShinePos({ x: shineX, y: shineY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    setIsHovered(false);
    // Smooth reset
    card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (to) {
      navigate(to);
    }
  };

  return (
    <div
      className="hero__3d-book-container"
      role="button"
      tabIndex={0}
      aria-label={`${altText} - Click to view gallery`}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e);
        }
      }}
      style={{
        perspective: '1200px',
        cursor: 'pointer',
        display: 'inline-block',
        outline: 'none',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Radiant ambient sun/gold background glow */}
      <div
        className="hero__3d-book-glow"
        aria-hidden="true"
        style={{
          transform: isHovered ? 'scale(1.15)' : 'scale(1)',
          opacity: isHovered ? 0.95 : 0.75,
          pointerEvents: 'none',
        }}
      />

      {/* 3D Preserved Card Shell */}
      <div
        ref={cardRef}
        className="hero__3d-book-card"
        style={{
          transformStyle: 'preserve-3d',
          transition: isHovered
            ? 'transform 0.1s ease-out, box-shadow 0.2s ease-out'
            : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.5s ease',
        }}
      >
        {/* Layer 1: Frame background with backdrop blur */}
        <div
          className="hero__3d-book-frame"
          style={{
            transform: 'translateZ(20px)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Layer 2: High-res Cover Image with depth elevation */}
          <div
            className="hero__3d-book-img-wrap"
            style={{
              transform: 'translateZ(45px)',
              transformStyle: 'preserve-3d',
            }}
          >
            <img
              src={assetPath(imageSrc)}
              alt={altText}
              className="hero__3d-book-img"
              loading="eager"
            />

            {/* Specular Glare / Holographic Light Sheen */}
            <div
              className="hero__3d-book-glare"
              aria-hidden="true"
              style={{
                opacity: isHovered ? 0.65 : 0,
                background: `radial-gradient(circle at ${shinePos.x}% ${shinePos.y}%, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.15) 40%, transparent 70%)`,
                transform: 'translateZ(55px)',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>

        {/* Layer 3: Floating Badge with maximum depth pop */}
        <div
          className="hero__3d-book-badge-wrap"
          style={{
            transform: 'translateZ(75px)',
          }}
        >
          <span className="hero__3d-book-badge">
            <span className="hero__3d-badge-pulse" aria-hidden="true"></span>
            <span className="hero__3d-badge-text">{badgeText}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Floating3DBook;
