import React, { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import '../styles/v2.css';
import NavbarV2 from './NavbarV2';
import FooterV2 from './FooterV2';
import SplashV2 from './SplashV2';

/**
 * V2Layout — Isolated shell for the parallel v2 redesign.
 *
 * Wraps all /v2/* routes in the `.v2-root` scope (so v2.css design tokens
 * apply and never leak to the original site), renders the floating NavbarV2,
 * the minimal FooterV2, and a one-time cinematic splash on entry.
 *
 * This layout persists across v2 child-route navigations, so the splash
 * plays once rather than on every click.
 */
const V2Layout = () => {
  const [showSplash, setShowSplash] = useState(true);
  const handleSplashFinished = useCallback(() => setShowSplash(false), []);

  return (
    <div className="v2-root">
      {showSplash && <SplashV2 onFinished={handleSplashFinished} />}
      <NavbarV2 />
      <main>
        <Outlet />
      </main>
      <FooterV2 />
    </div>
  );
};

export default V2Layout;
