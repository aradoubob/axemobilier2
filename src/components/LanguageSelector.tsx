import React from 'react';
import { useLanguageStore, type Language } from '../lib/i18n';

const languages = [
  { code: 'ro' as Language, name: 'Română', flag: '🇷🇴' },
  { code: 'de' as Language, name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en' as Language, name: 'English', flag: '🇬🇧' },
  { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
] as const;

export function LanguageSelector() {
  const { language, setLanguage } = useLanguageStore();

  return (
    <div className="relative group">
      <button 
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Sélectionner la langue"
      >
        <span role="img" aria-label={languages.find(l => l.code === language)?.name}>
          {languages.find(l => l.code === language)?.flag}
        </span>
        <span className="hidden sm:inline">
          {languages.find(l => l.code === language)?.name}
        </span>
      </button>
      <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-gray-100 transition-colors ${
              language === lang.code ? 'text-axe-blue font-semibold' : 'text-gray-700'
            }`}
            aria-label={`Changer la langue en ${lang.name}`}
          >
            <span role="img" aria-label={lang.name}>{lang.flag}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}