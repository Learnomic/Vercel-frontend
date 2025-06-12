// Translator.tsx
import { useTranslation } from '../context/TranslationContext';
import { useState, useEffect } from 'react';

const Translator = () => {
  const { currentLanguage, setLanguage, isTransitioning, translationReady } = useTranslation();
  const [delayedActive, setDelayedActive] = useState(false);
  const [languageSupport, setLanguageSupport] = useState({
    en: true,
    hi: true,
    mr: true,
    kn: true
  });

  // Check which languages are actually supported
  useEffect(() => {
    if (translationReady) {
      const checkLanguageSupport = () => {
        const selectField = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (selectField) {
          const supportedLanguages = Array.from(selectField.options).map(option => option.value);
         
          setLanguageSupport({
            en: supportedLanguages.includes('en'),
            hi: supportedLanguages.includes('hi'),
            mr: supportedLanguages.includes('mr'),
            kn: supportedLanguages.includes('kn')
          });
         
          console.log('Language support check:', {
            available: supportedLanguages,
            mr: supportedLanguages.includes('mr'),
            kn: supportedLanguages.includes('kn')
          });
        }
      };
     
      checkLanguageSupport();
    }
  }, [translationReady]);

  // Handle the delay for active classes
  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        setDelayedActive(true);
      }, 400);
     
      return () => clearTimeout(timer);
    } else {
      setDelayedActive(false);
    }
  }, [isTransitioning]);

  const getButtonClasses = (isActive: boolean, isSupported: boolean = true) => {
    const baseClasses = "px-3 py-1 text-white rounded text-sm transition-all duration-300 ease-in-out transform";
    const activeClasses = delayedActive ? "btn-gradient scale-105 shadow-lg" : "primary-gradient hover:scale-102";
    const inactiveClasses = "primary-gradient hover:scale-102";
    const disabledClasses = (isTransitioning || !translationReady || !isSupported)
      ? "opacity-70 cursor-not-allowed"
      : "cursor-pointer";
    const unsupportedClasses = !isSupported ? "bg-gray-400 hover:bg-gray-400" : "";
   
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${disabledClasses} ${unsupportedClasses}`;
  };

  const handleLanguageChange = async (lang: "en" | "hi" | "mr" | "kn") => {
    if (!isTransitioning && lang !== currentLanguage && translationReady && languageSupport[lang]) {
      console.log(`Attempting to change to language: ${lang}`);
     
      // Add a small delay to ensure proper state management
      setTimeout(() => {
        setLanguage(lang);
      }, 100);
    } else if (!languageSupport[lang]) {
      console.warn(`Language ${lang} is not supported by Google Translate`);
      alert(`Sorry, ${lang === 'mr' ? 'Marathi' : 'Kannada'} translation is not available in this environment.`);
    }
  };

  const getLanguageDisplayName = (lang: string) => {
    const names = {
      en: 'English',
      hi: 'हिंदी',
      mr: 'मराठी',
      kn: 'ಕನ್ನಡ'
    };
    return names[lang as keyof typeof names] || lang;
  };

  return (
    <div className="flex gap-2 p-2 bg-white/80 backdrop-blur-sm rounded-bl-lg shadow-md">
      {!translationReady && (
        <div className="flex items-center mr-2 text-sm text-gray-600">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500 mr-2"></div>
          Loading translator...
        </div>
      )}
     
      <button
        className={getButtonClasses(currentLanguage === 'en', languageSupport.en)}
        onClick={() => handleLanguageChange("en")}
        disabled={isTransitioning || !translationReady}
        title={!languageSupport.en ? "English not supported" : ""}
      >
        English
      </button>
     
      <button
        className={getButtonClasses(currentLanguage === 'hi', languageSupport.hi)}
        onClick={() => handleLanguageChange("hi")}
        disabled={isTransitioning || !translationReady}
        title={!languageSupport.hi ? "Hindi not supported" : ""}
      >
        हिंदी
      </button>
     
      <button
        className={getButtonClasses(currentLanguage === 'mr', languageSupport.mr)}
        onClick={() => handleLanguageChange("mr")}
        disabled={isTransitioning || !translationReady || !languageSupport.mr}
        title={!languageSupport.mr ? "Marathi not supported in this environment" : ""}
      >
        मराठी
        {!languageSupport.mr && <span className="ml-1 text-xs">⚠️</span>}
      </button>
     
      <button
        className={getButtonClasses(currentLanguage === 'kn', languageSupport.kn)}
        onClick={() => handleLanguageChange("kn")}
        disabled={isTransitioning || !translationReady || !languageSupport.kn}
        title={!languageSupport.kn ? "Kannada not supported in this environment" : ""}
      >
        ಕನ್ನಡ
        {!languageSupport.kn && <span className="ml-1 text-xs">⚠️</span>}
      </button>
     
      {isTransitioning && (
        <div className="flex items-center ml-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-xs text-gray-600">
            Translating to {getLanguageDisplayName(currentLanguage)}...
          </span>
        </div>
      )}
     
      {translationReady && (
        <div className="flex items-center ml-2 text-xs text-green-600">
          ✓ Ready
        </div>
      )}
    </div>
  );
};

export default Translator;