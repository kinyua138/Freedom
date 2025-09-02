import React, { useState } from 'react';
import { GlobeIcon, CheckIcon } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';

const LanguageSelector = ({ className = '' }) => {
  const { currentLanguage, changeLanguage, getAvailableLanguages, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  
  const languages = getAvailableLanguages();
  const currentLang = languages.find(lang => lang.code === currentLanguage);

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        title={t('common.language')}
      >
        <GlobeIcon className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLang?.nativeName}</span>
        <span className="sm:hidden">{currentLang?.code.toUpperCase()}</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-20">
            <div className="py-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-8 text-xs font-mono text-gray-500 dark:text-slate-400">
                      {language.code.toUpperCase()}
                    </span>
                    <div>
                      <div className="font-medium">{language.nativeName}</div>
                      <div className="text-xs text-gray-500 dark:text-slate-400">{language.name}</div>
                    </div>
                  </div>
                  {currentLanguage === language.code && (
                    <CheckIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;
