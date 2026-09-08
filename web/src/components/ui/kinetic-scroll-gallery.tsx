import React from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { assetPath } from "../../utils/assetPath";
import { bookGalleryImages } from "../../data/storybookGallery";
import "./kinetic-scroll-gallery.css";

export interface GalleryItem {
  src: string;
  title: string;
  land?: string;
  caption?: string;
  isTextbook?: boolean;
}

interface KineticGridItemProps {
  item: GalleryItem | string;
  scrollVelocity: any;
}

const KineticGridItem: React.FC<KineticGridItemProps> = ({ item, scrollVelocity }) => {
  const itemObj: GalleryItem = typeof item === 'string' ? { src: item, title: 'Storybook Illustration' } : item;

  // Smooth velocity for gentle skew without clipping content
  const smoothedVelocity = useSpring(scrollVelocity, {
    mass: 0.1,
    stiffness: 90,
    damping: 45,
  });

  // Transform velocity into subtle skew
  const skew = useTransform(smoothedVelocity, [-1500, 0, 1500], [-6, 0, 6]);

  return (
    <motion.div
      className={`kinetic-gallery-card group ${itemObj.isTextbook ? 'kinetic-gallery-card--textbook' : ''}`}
      style={{ skewX: skew }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
    >
      {/* Framed Thumbnail Window */}
      <div className="kinetic-gallery-window">
        <img
          src={assetPath(itemObj.src)}
          alt={itemObj.title}
          className="kinetic-gallery-img"
          loading="lazy"
        />
        {itemObj.land && (
          <div className="kinetic-gallery-window-badge">
            <span className={`kinetic-gallery-tag ${itemObj.isTextbook ? 'kinetic-gallery-tag--textbook' : ''}`}>
              {itemObj.isTextbook ? `📖 ${itemObj.land}` : itemObj.land}
            </span>
          </div>
        )}
      </div>

      {/* Structured Info Pane */}
      <div className="kinetic-gallery-info">
        <h3 className="kinetic-gallery-card-title">{itemObj.title}</h3>
        {itemObj.caption && (
          <p className="kinetic-gallery-card-caption">{itemObj.caption}</p>
        )}
      </div>
    </motion.div>
  );
};

interface KineticScrollGalleryProps {
  items?: (GalleryItem | string)[];
  title?: string;
  subtitle?: string;
}

export default function KineticScrollGallery({
  items = bookGalleryImages,
  title = "Rhythm Quest Storybook",
  subtitle = "Explore selected sample pages from the 66-page multi-sensory storybook and curriculum across the 7 developmental lands, featuring our 15 heroic guides."
}: KineticScrollGalleryProps) {
  const { scrollYProgress } = useScroll();

  const scrollYVelocity = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 1000],
    { clamp: false }
  );

  return (
    <div className="kinetic-gallery-wrapper">
      {/* Scenic Meadow Background Backdrop */}
      <div className="kinetic-gallery-scenic-bg" aria-hidden="true">
        <img
          src={assetPath('/assets/backgrounds/gallery-meadow-bg.webp')}
          alt=""
          className="kinetic-gallery-scenic-img"
        />
        <div className="kinetic-gallery-scenic-scrim" />
      </div>

      <div className="kinetic-gallery-container">
        <div className="kinetic-gallery-header">
          <div className="kinetic-gallery-badge-wrap">
            <div className="kinetic-gallery-badge-top">
              📖 The Sound of Essentials: Companion Storybook
            </div>
          </div>
          <h1 className="kinetic-gallery-title">
            <span className="kinetic-gallery-title-text">{title}</span>
            <span className="gallery__sticker-wrap" title="Sample Pages!">
              <img
                src={assetPath('/assets/stickers/sample-pages-sticker.webp')}
                alt="Sample Pages!"
                className="gallery__sticker-img"
                width="190"
                height="150"
                loading="eager"
              />
            </span>
          </h1>
          <p className="kinetic-gallery-subtitle">
            {subtitle}
          </p>
        </div>

        <div className="kinetic-gallery-grid">
          {items.map((item, index) => (
            <KineticGridItem
              key={index}
              item={item}
              scrollVelocity={scrollYVelocity}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
