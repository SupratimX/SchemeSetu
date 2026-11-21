import { useState, useEffect } from 'preact/hooks';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import Home from './pages/Home.jsx';
import Quiz from './pages/Quiz.jsx';
import Results from './pages/Results.jsx';
import SchemeDetailPage from './pages/SchemeDetailPage.jsx';
import Browse from './pages/Browse.jsx';
import Saved from './pages/Saved.jsx';
import About from './pages/About.jsx';
import DocumentChecklistPage from './pages/DocumentChecklistPage.jsx';
import { language, fontSize, highContrast } from './store/profile.js';
import { initLanguage } from './utils/i18n.js';

const getRoute = () => (window.location.hash || '#/').replace(/^#/, '').split('?')[0] || '/';

const staticRoutes = {
  '/': <Home />,
  '/quiz': <Quiz />,
  '/results': <Results />,
  '/browse': <Browse />,
  '/saved': <Saved />,
  '/about': <About />,
  '/checklist': <DocumentChecklistPage />
};

export default function App() {
  const [route, setRoute] = useState(getRoute);
  const lang = language.value, fs = fontSize.value, hc = highContrast.value;

  useEffect(() => {
    initLanguage(lang);
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  useEffect(() => {
    ['documentElement', 'body'].forEach(el => {
      if (document[el]) {
        document[el].classList.toggle('high-contrast', hc);
        document[el].classList.toggle('dark', hc);
      }
    });
  }, [hc]);

  useEffect(() => {
    const onHash = () => {
      setRoute(getRoute());
      window.scrollTo({ top: 0, behavior: 'instant' });
      const mainEl = document.getElementById('main-content');
      if (mainEl) mainEl.focus();
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const schemeMatch = route.match(/^\/scheme\/(.+)$/);
  const page = schemeMatch ? <SchemeDetailPage id={schemeMatch[1]} /> : (staticRoutes[route] || <Home />);

  const containerClasses = [
    'min-h-screen flex flex-col',
    hc && 'high-contrast dark',
    fs === 'large' ? 'font-large' : fs === 'x-large' ? 'font-x-large' : ''
  ].filter(Boolean).join(' ');

  return (
    <ErrorBoundary>
      <div class={containerClasses}>
        <Header />
        <main id="main-content" role="main" tabIndex="-1" class="flex-1 focus:outline-none">
          {page}
        </main>
        <Footer />
        <div class="sr-only" aria-live="polite" aria-atomic="true">
          Page navigated to {route}
        </div>
      </div>
    </ErrorBoundary>
  );
}
