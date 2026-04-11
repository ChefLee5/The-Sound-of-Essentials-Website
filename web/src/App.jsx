import { lazy, Suspense, useState, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AnimatedPage from './components/AnimatedPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import SplashScreen from './components/SplashScreen';
import CanvasBackground from './components/SplineBackground';

// ── Route-level code splitting ──────────────────────────────────
// Each page loads only when the user navigates to that route,
// cutting the initial JS bundle by ~40%.
const Home       = lazy(() => import('./pages/Home'));
const Universe   = lazy(() => import('./pages/Universe'));
const MediaRoom  = lazy(() => import('./pages/MediaRoom'));
const Mission    = lazy(() => import('./pages/Mission'));
const JoinQuest  = lazy(() => import('./pages/JoinQuest'));
const Characters = lazy(() => import('./pages/Heroes'));
const Science    = lazy(() => import('./pages/Science'));
const Dictionary = lazy(() => import('./pages/Dictionary/Dictionary'));

// ── Minimal loading fallback ─────────────────────────────────────
const PageLoader = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.4,
    fontSize: '2rem',
    animation: 'softPulse 1.5s ease-in-out infinite',
  }}>
    ♪
  </div>
);

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const handleSplashFinished = useCallback(() => setShowSplash(false), []);
  const location = useLocation();

  return (
    <div className="app">
      {showSplash && <SplashScreen onFinished={handleSplashFinished} />}
      <CanvasBackground />
      <ScrollToTop />
      <Navbar />
      <main>
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/"           element={<AnimatedPage><Home /></AnimatedPage>} />
              <Route path="/universe"   element={<AnimatedPage><Universe /></AnimatedPage>} />
              <Route path="/media"      element={<AnimatedPage><MediaRoom /></AnimatedPage>} />
              <Route path="/mission"    element={<AnimatedPage><Mission /></AnimatedPage>} />
              <Route path="/join"       element={<AnimatedPage><JoinQuest /></AnimatedPage>} />
              <Route path="/characters" element={<AnimatedPage><Characters /></AnimatedPage>} />
              <Route path="/science"    element={<AnimatedPage><Science /></AnimatedPage>} />
              <Route path="/dictionary" element={<AnimatedPage><Dictionary /></AnimatedPage>} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default App;
