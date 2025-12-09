import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './LanguageSwitcher.css';

function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button 
      className="language-switcher"
      onClick={toggleLanguage}
      title={language === 'en' ? 'Переключить на русский' : 'Switch to English'}
    >
      {language === 'en' ? '🇷🇺 RU' : '🇬🇧 EN'}
    </button>
  );
}

export default LanguageSwitcher;

