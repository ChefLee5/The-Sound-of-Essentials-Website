import { lazy, Suspense, useState, useCallback } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
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
// MediaRoom is now merged into Listen — /media redirects to /listen
const Mission    = lazy(() => import('./pages/Mission'));
const JoinQuest  = lazy(() => import('./pages/JoinQuest'));
const Heroes     = lazy(() => import('./pages/Heroes'));
const Science    = lazy(() => import('./pages/Science'));
const AllyAnnex  = lazy(() => import('./pages/AllyAnnex'));
const DictionarySale = lazy(() => import('./pages/DictionarySale'));
const Listen     = lazy(() => import('./pages/Listen'));
const Player     = lazy(() => import('./pages/Player'));

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
              <Route path="/media"      element={<Navigate to="/listen" replace />} />
              <Route path="/mission"    element={<AnimatedPage><Mission /></AnimatedPage>} />
              <Route path="/listen"    element={<AnimatedPage><Listen /></AnimatedPage>} />
              <Route path="/join"       element={<AnimatedPage><JoinQuest /></AnimatedPage>} />
              <Route path="/characters" element={<Navigate to="/heroes" replace />} />
              <Route path="/heroes"     element={<AnimatedPage><Heroes /></AnimatedPage>} />
              <Route path="/science"    element={<AnimatedPage><Science /></AnimatedPage>} />
              <Route path="/allies"    element={<AnimatedPage><AllyAnnex /></AnimatedPage>} />
              <Route path="/dictionary" element={<AnimatedPage><DictionarySale /></AnimatedPage>} />
              <Route path="/player"     element={<AnimatedPage><Player /></AnimatedPage>} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default App;
