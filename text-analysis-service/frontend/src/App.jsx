import React from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Analyzer from './pages/Analyzer';
import LanguageSwitcher from './components/LanguageSwitcher';
import './App.css';

function AppContent() {
  const { t } = useLanguage();

  return (
    <div className="App">
      <LanguageSwitcher />
      <header className="App-header">
        <h1>{t('title')}</h1>
        <p>{t('subtitle')}</p>
      </header>
      <main>
        <Analyzer />
      </main>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;

