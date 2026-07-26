import { lazy, Suspense, useState, useCallback } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AnimatedPage from './components/AnimatedPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import SplashScreen from './components/SplashScreen';
import CubeLoader from './components/CubeLoader';
import CanvasBackground from './components/SplineBackground';
import './styles/v2.css';
import V2Layout from './components-v2/V2Layout';

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
const RhythmQuestSale = lazy(() => import('./pages/RhythmQuestSale'));
const Listen     = lazy(() => import('./pages/Listen'));
const Player     = lazy(() => import('./pages/Player'));

// ── V2 Redesign Routes (parallel, isolated under /v2) ───────────
const HomeV2      = lazy(() => import('./pages-v2/HomeV2'));
const UniverseV2  = lazy(() => import('./pages-v2/UniverseV2'));
const HeroesV2    = lazy(() => import('./pages-v2/HeroesV2'));
const ListenV2    = lazy(() => import('./pages-v2/ListenV2'));
const ScienceV2   = lazy(() => import('./pages-v2/ScienceV2'));
const MissionV2   = lazy(() => import('./pages-v2/MissionV2'));
const JoinQuestV2 = lazy(() => import('./pages-v2/JoinQuestV2'));

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const handleSplashFinished = useCallback(() => setShowSplash(false), []);
  const location = useLocation();

  // The v2 redesign lives under /v2 with its own isolated chrome (NavbarV2,
  // FooterV2, SplashV2 via V2Layout). Suppress the original site chrome there.
  const isV2 = location.pathname === '/v2' || location.pathname.startsWith('/v2/');

  return (
    <div className="app">
      {!isV2 && showSplash && <SplashScreen onFinished={handleSplashFinished} />}
      {!isV2 && <CanvasBackground />}
      <ScrollToTop />
      {!isV2 && <Navbar />}
      <main>
        <Suspense fallback={<CubeLoader compact />}>
          {isV2 ? (
            // ── V2 routes: no AnimatePresence keying, so V2Layout persists
            //    across child navigations (splash plays once). ──
            <Routes location={location}>
              <Route path="/v2" element={<V2Layout />}>
                <Route index element={<HomeV2 />} />
                <Route path="universe" element={<UniverseV2 />} />
                <Route path="heroes" element={<HeroesV2 />} />
                <Route path="listen" element={<ListenV2 />} />
                <Route path="science" element={<ScienceV2 />} />
                <Route path="mission" element={<MissionV2 />} />
                <Route path="join" element={<JoinQuestV2 />} />
              </Route>
            </Routes>
          ) : (
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
                <Route path="/rhythm-quest" element={<AnimatedPage><RhythmQuestSale /></AnimatedPage>} />
                <Route path="/player"     element={<AnimatedPage><Player /></AnimatedPage>} />
              </Routes>
            </AnimatePresence>
          )}
        </Suspense>
      </main>
      {!isV2 && <Footer />}
    </div>
  );
};

export default App;
