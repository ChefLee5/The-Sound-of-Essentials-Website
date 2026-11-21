import React from 'react';
import { Link } from 'react-router-dom';
import { RESOURCE_PILLARS } from '../data/resourcesData';

/**
 * Lightweight 4-stage horizontal navigator pinned cleanly at the bottom of
 * pillar and article pages so readers move smoothly across Parts 1–4 without
 * heavy visual clutter.
 */
const ResourcePillarStrip = ({ activePillarId = null }) => {
  return (
    <nav className="res-strip" aria-label="Continue through the 4-Part Learning Library">
      <div className="res-strip__header">
        <span className="res-strip__eyebrow">CONTINUE THE 4-PART LIBRARY</span>
        <Link to="/resources" className="res-strip__all-link">
          All Library Stages →
        </Link>
      </div>
      <div className="res-strip__grid">
        {RESOURCE_PILLARS.map((pillar) => {
          const isActive = pillar.id === activePillarId;
          return (
            <Link
              key={pillar.id}
              to={pillar.path}
              className={`res-strip-pill ${isActive ? 'res-strip-pill--active' : ''}`}
              style={{ '--pillar-accent': pillar.accentColor }}
            >
              <span className="res-strip-pill__num">0{pillar.partNumber}</span>
              <div className="res-strip-pill__text">
                <strong className="res-strip-pill__title">{pillar.shortTitle}</strong>
                <span className="res-strip-pill__sub">{pillar.cardSubtitle}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default ResourcePillarStrip;
