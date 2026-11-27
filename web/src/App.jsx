import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AnimatedPage from './components/AnimatedPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import CubeLoader from './components/CubeLoader';
import CanvasBackground from './components/SplineBackground';
import V2Layout from './components-v2/V2Layout';
import useAnalytics from './hooks/useAnalytics';
import CookieConsent from './components/CookieConsent';
import AskSeriphiaModal from './components/AskSeriphiaModal';
import Home from './pages/Home';

// ── Route-level code splitting ──────────────────────────────────
const Mission    = lazy(() => import('./pages/Mission'));
const JoinQuest  = lazy(() => import('./pages/JoinQuest'));
const Heroes     = lazy(() => import('./pages/Heroes'));
const Science    = lazy(() => import('./pages/Science'));
const RhythmQuestSale = lazy(() => import('./pages/RhythmQuestSale'));
const HeadphonesSale = lazy(() => import('./pages/HeadphonesSale'));
const Listen     = lazy(() => import('./pages/Listen'));
const Player     = lazy(() => import('./pages/Player'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const Gallery    = lazy(() => import('./pages/Gallery'));
const AdsShowcase = lazy(() => import('./pages/AdsShowcase'));
const CampaignLauncher = lazy(() => import('./pages/CampaignLauncher'));
const AdminCrm   = lazy(() => import('./pages/AdminCrm'));
const ProgrammaticPersonaPage = lazy(() => import('./pages/ProgrammaticPersonaPage'));
const SolutionsHub = lazy(() => import('./pages/SolutionsHub'));
const AdvertorialStory = lazy(() => import('./pages/AdvertorialStory'));
const AbcMouseAlternatives = lazy(() => import('./pages/AbcMouseAlternatives'));
const ReadingEggsAlternatives = lazy(() => import('./pages/ReadingEggsAlternatives'));
const HookedOnPhonicsAlternatives = lazy(() => import('./pages/HookedOnPhonicsAlternatives'));
const DadReadingAppsReview = lazy(() => import('./pages/DadReadingAppsReview'));
const EducationSovereignty = lazy(() => import('./pages/EducationSovereignty'));
const GlobalLearnEnglish = lazy(() => import('./pages/GlobalLearnEnglish'));
const SingAlongTime = lazy(() => import('./pages/SingAlongTime'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const DmcaPolicy = lazy(() => import('./pages/DmcaPolicy'));
const InstitutionsQpc = lazy(() => import('./pages/InstitutionsQpc'));
const ResourcesHub = lazy(() => import('./pages/ResourcesHub'));
const ResourcePillarPage = lazy(() => import('./pages/ResourcePillarPage'));
const ResourceArticlePage = lazy(() => import('./pages/ResourceArticlePage'));
const NotFound   = lazy(() => import('./pages/NotFound'));

// ── V2 Redesign Routes (parallel, isolated under /v2) ───────────
const HomeV2      = lazy(() => import('./pages-v2/HomeV2'));
const HeroesV2    = lazy(() => import('./pages-v2/HeroesV2'));
const ListenV2    = lazy(() => import('./pages-v2/ListenV2'));
const ScienceV2   = lazy(() => import('./pages-v2/ScienceV2'));
const MissionV2   = lazy(() => import('./pages-v2/MissionV2'));
const JoinQuestV2 = lazy(() => import('./pages-v2/JoinQuestV2'));

const App = () => {
  useAnalytics();
  const location = useLocation();
  const isV2 = location.pathname === '/v2' || location.pathname.startsWith('/v2/');
  const isMcls = location.pathname === '/mcls' || location.pathname === '/launcher';
  const isAdmin = location.pathname.startsWith('/admin') || location.pathname.startsWith('/crm') || isMcls;

  useEffect(() => {
    if (isAdmin || isV2) {
      let robotsMeta = document.querySelector('meta[name="robots"]');
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.name = 'robots';
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.setAttribute('content', 'noindex, nofollow');
    }
  }, [isAdmin, isV2, location.pathname]);

  return (
    <div className="app">
      {!isV2 && !isMcls && <CanvasBackground />}
      <ScrollToTop />
      {!isV2 && !isAdmin && <Navbar />}
      <main style={{ minHeight: '100vh' }}>
        <Suspense fallback={<div style={{ minHeight: '100vh' }}><CubeLoader compact /></div>}>
          {isV2 ? (
            <Routes>
              <Route path="/v2" element={<V2Layout />}>
                <Route index element={<HomeV2 />} />
                <Route path="heroes" element={<HeroesV2 />} />
                <Route path="listen" element={<ListenV2 />} />
                <Route path="science" element={<ScienceV2 />} />
                <Route path="mission" element={<MissionV2 />} />
                <Route path="join" element={<JoinQuestV2 />} />
              </Route>
            </Routes>
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              <Routes key={location.pathname}>
                <Route path="/"           element={<AnimatedPage><Home /></AnimatedPage>} />
                <Route path="/universe"   element={<Navigate to="/heroes" replace />} />
                <Route path="/media"      element={<Navigate to="/listen" replace />} />
                <Route path="/mission"    element={<AnimatedPage><Mission /></AnimatedPage>} />
                <Route path="/about"      element={<Navigate to="/mission" replace />} />
                <Route path="/listen"     element={<AnimatedPage><Listen /></AnimatedPage>} />
                <Route path="/qr"         element={<Navigate to="/listen" replace />} />
                <Route path="/ritual"     element={<Navigate to="/listen" replace />} />
                <Route path="/join"       element={<AnimatedPage><JoinQuest /></AnimatedPage>} />
                <Route path="/characters" element={<Navigate to="/heroes" replace />} />
                <Route path="/heroes"     element={<AnimatedPage><Heroes /></AnimatedPage>} />
                <Route path="/science"    element={<AnimatedPage><Science /></AnimatedPage>} />
                <Route path="/allies"     element={<Navigate to="/" replace />} />
                <Route path="/ally-annex" element={<Navigate to="/institutions" replace />} />
                <Route path="/dictionary" element={<Navigate to="/workbook#dictionary-presale" replace />} />
                <Route path="/workbook"   element={<AnimatedPage><RhythmQuestSale /></AnimatedPage>} />
                <Route path="/curriculum" element={<Navigate to="/rhythm-ready" replace />} />
                <Route path="/rhythmready" element={<Navigate to="/rhythm-ready" replace />} />
                <Route path="/rhythm-ready" element={<AnimatedPage><RhythmQuestSale /></AnimatedPage>} />
                <Route path="/rhythm-quest" element={<Navigate to="/rhythm-ready" replace />} />
                <Route path="/rhythmquest" element={<Navigate to="/rhythm-ready" replace />} />
                <Route path="/start"      element={<Navigate to="/rhythm-ready" replace />} />
                <Route path="/starter-pack" element={<Navigate to="/listen" replace />} />
                <Route path="/headphones" element={<AnimatedPage><HeadphonesSale /></AnimatedPage>} />
                <Route path="/shop"       element={<Navigate to="/headphones" replace />} />
                <Route path="/sensory-headphones" element={<Navigate to="/headphones" replace />} />
                <Route path="/gallery"    element={<AnimatedPage><Gallery /></AnimatedPage>} />
                <Route path="/player"     element={<AnimatedPage><Player /></AnimatedPage>} />
                <Route path="/ads"        element={<AnimatedPage><AdsShowcase /></AnimatedPage>} />
                <Route path="/ads-showcase" element={<AnimatedPage><AdsShowcase /></AnimatedPage>} />
                <Route path="/campaigns"  element={<AnimatedPage><AdsShowcase /></AnimatedPage>} />
                <Route path="/launcher"   element={<AnimatedPage><CampaignLauncher /></AnimatedPage>} />
                <Route path="/mcls"       element={<AnimatedPage><CampaignLauncher /></AnimatedPage>} />
                <Route path="/order-success" element={<AnimatedPage><OrderSuccess /></AnimatedPage>} />
                <Route path="/download"   element={<AnimatedPage><OrderSuccess /></AnimatedPage>} />
                {/* 4-Part "Start Here." Resources Hub & Weekly Sound Notes */}
                <Route path="/resources" element={<AnimatedPage><ResourcesHub /></AnimatedPage>} />
                <Route path="/resources/foundations" element={<AnimatedPage><ResourcePillarPage pillarId="foundations" /></AnimatedPage>} />
                <Route path="/resources/play" element={<AnimatedPage><ResourcePillarPage pillarId="play" /></AnimatedPage>} />
                <Route path="/resources/readiness" element={<AnimatedPage><ResourcePillarPage pillarId="readiness" /></AnimatedPage>} />
                <Route path="/resources/classrooms" element={<AnimatedPage><ResourcePillarPage pillarId="classrooms" /></AnimatedPage>} />
                <Route path="/resources/notes" element={<AnimatedPage><ResourcePillarPage pillarId="notes" /></AnimatedPage>} />
                <Route path="/resources/:slug" element={<AnimatedPage><ResourceArticlePage /></AnimatedPage>} />
                {/* Programmatic SEO Solutions Engine */}
                <Route path="/solutions" element={<AnimatedPage><SolutionsHub /></AnimatedPage>} />
                <Route path="/institutions" element={<AnimatedPage><InstitutionsQpc /></AnimatedPage>} />
                <Route path="/classroom" element={<Navigate to="/institutions" replace />} />
                <Route path="/enterprise" element={<Navigate to="/institutions" replace />} />
                <Route path="/qpc" element={<Navigate to="/institutions" replace />} />
                <Route path="/for/:slug" element={<AnimatedPage><ProgrammaticPersonaPage /></AnimatedPage>} />
                <Route path="/solutions/:slug" element={<AnimatedPage><ProgrammaticPersonaPage /></AnimatedPage>} />
                <Route path="/guides/:slug" element={<AnimatedPage><ProgrammaticPersonaPage /></AnimatedPage>} />
                {/* Native Advertorial & Pre-sell Bridge Pages */}
                <Route path="/story" element={<AnimatedPage><AdvertorialStory /></AnimatedPage>} />
                <Route path="/quieter-way" element={<Navigate to="/story" replace />} />
                <Route path="/advertorial" element={<Navigate to="/story" replace />} />
                {/* Sovereign Editorial Pre-Sell Bridge Routes */}
                <Route path="/dad-reading-apps-review" element={<AnimatedPage><DadReadingAppsReview /></AnimatedPage>} />
                <Route path="/dad-review" element={<Navigate to="/dad-reading-apps-review" replace />} />
                <Route path="/education-sovereignty" element={<AnimatedPage><EducationSovereignty /></AnimatedPage>} />
                <Route path="/sovereign-child" element={<Navigate to="/education-sovereignty" replace />} />
                <Route path="/global-learn-english" element={<AnimatedPage><GlobalLearnEnglish /></AnimatedPage>} />
                <Route path="/sound-before-symbol" element={<Navigate to="/global-learn-english" replace />} />
                <Route path="/sing-along-time" element={<AnimatedPage><SingAlongTime /></AnimatedPage>} />
                <Route path="/rhythm-reset" element={<Navigate to="/sing-along-time" replace />} />
                {/* Competitor Alternative & Comparison Listicles */}
                <Route path="/alternatives/abcmouse" element={<AnimatedPage><AbcMouseAlternatives /></AnimatedPage>} />
                <Route path="/abcmouse-alternatives" element={<Navigate to="/alternatives/abcmouse" replace />} />
                <Route path="/compare/abcmouse" element={<Navigate to="/alternatives/abcmouse" replace />} />
                <Route path="/alternatives/reading-eggs" element={<AnimatedPage><ReadingEggsAlternatives /></AnimatedPage>} />
                <Route path="/reading-eggs-alternatives" element={<Navigate to="/alternatives/reading-eggs" replace />} />
                <Route path="/compare/reading-eggs" element={<Navigate to="/alternatives/reading-eggs" replace />} />
                <Route path="/alternatives/hooked-on-phonics" element={<AnimatedPage><HookedOnPhonicsAlternatives /></AnimatedPage>} />
                <Route path="/hooked-on-phonics-alternatives" element={<Navigate to="/alternatives/hooked-on-phonics" replace />} />
                <Route path="/compare/hooked-on-phonics" element={<Navigate to="/alternatives/hooked-on-phonics" replace />} />
                <Route path="/admin/crm"  element={<AnimatedPage><AdminCrm /></AnimatedPage>} />
                <Route path="/admin/crm/*" element={<AnimatedPage><AdminCrm /></AnimatedPage>} />
                <Route path="/admin"      element={<Navigate to="/admin/crm" replace />} />
                <Route path="/admin/*"    element={<Navigate to="/admin/crm" replace />} />
                <Route path="/crm"        element={<Navigate to="/admin/crm" replace />} />
                <Route path="/crm/*"      element={<Navigate to="/admin/crm" replace />} />
                {/* Legal & Compliance Protocol Routes */}
                <Route path="/privacy"    element={<AnimatedPage><PrivacyPolicy /></AnimatedPage>} />
                <Route path="/terms"      element={<AnimatedPage><TermsOfService /></AnimatedPage>} />
                <Route path="/dmca"       element={<AnimatedPage><DmcaPolicy /></AnimatedPage>} />
                <Route path="*"           element={<AnimatedPage><NotFound /></AnimatedPage>} />
              </Routes>
            </AnimatePresence>
          )}
        </Suspense>
      </main>
      <CookieConsent />
      {!isV2 && !isAdmin && <AskSeriphiaModal />}
      {!isV2 && !isAdmin && <Footer />}
    </div>
  );
};

export default App;
