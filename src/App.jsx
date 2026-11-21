import { useState, useEffect } from 'preact/hooks';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
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

function getRoute() {
  const hash = window.location.hash || '#/';
  const clean = hash.replace(/^#/, '') || '/';
  return clean.split('?')[0]; // Remove query string from route matching
}

export default function App() {
  const [route, setRoute] = useState(getRoute);

  const lang = language.value;
  const fs = fontSize.value;
  const hc = highContrast.value;

  useEffect(() => {
    initLanguage(lang);
  }, [lang]);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRoute());
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Simple, robust client router
  let pageComponent;
  const schemeMatch = route.match(/^\/scheme\/(.+)$/);

  if (route === '/' || route === '') {
    pageComponent = <Home />;
  } else if (route === '/quiz') {
    pageComponent = <Quiz />;
  } else if (route === '/results') {
    pageComponent = <Results />;
  } else if (schemeMatch) {
    pageComponent = <SchemeDetailPage id={schemeMatch[1]} />;
  } else if (route === '/browse') {
    pageComponent = <Browse />;
  } else if (route === '/saved') {
    pageComponent = <Saved />;
  } else if (route === '/about') {
    pageComponent = <About />;
  } else if (route === '/checklist') {
    pageComponent = <DocumentChecklistPage />;
  } else {
    pageComponent = <Home />;
  }

  const containerClasses = [
    'min-h-screen flex flex-col',
    hc ? 'high-contrast' : '',
    fs === 'large' ? 'font-large' : fs === 'x-large' ? 'font-x-large' : ''
  ].filter(Boolean).join(' ');

  return (
    <div class={containerClasses}>
      <Header />
      <main class="flex-1">
        {pageComponent}
      </main>
      <Footer />
    </div>
  );
}
