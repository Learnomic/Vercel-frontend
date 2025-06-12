// // Translator.tsx
// import { useTranslation } from '../context/TranslationContext';

// const Translator = () => {
//   const { currentLanguage, setLanguage } = useTranslation();


//   return (
//     <div className="flex gap-2 p-2 bg-white/80 backdrop-blur-sm rounded-bl-lg shadow-md">
//       <button
//         className={`px-3 py-1 ${currentLanguage === 'en' ? 'btn-gradient' : 'text-white border-solid border-[primary-gradient] primary-gradient b-[primary-gradient] '} text-white rounded text-sm hover:primary-gradient transition-colors`}
//         onClick={() => setLanguage("en")}
//       >
//         English
//       </button>
//       <button
//         className={`px-3 py-1 ${currentLanguage === 'hi' ? 'btn-gradient' : 'primary-gradient'} text-white rounded text-sm hover:bg-green-600 transition-colors`}
//         onClick={() => setLanguage("hi")}
//       >
//         हिंदी
//       </button>
//       <button
//         className={`px-3 py-1 ${currentLanguage === 'mr' ? 'btn-gradient' : 'primary-gradient'} text-white rounded text-sm hover:bg-yellow-600 transition-colors`}
//         onClick={() => setLanguage("mr")}
//       >
//         मराठी
//       </button>
//       <button
//         className={`px-3 py-1 ${currentLanguage === 'kn' ? 'btn-gradient' : 'primary-gradient'} text-white rounded text-sm hover:bg-yellow-600 transition-colors`}
//         onClick={() => setLanguage("kn")}
//       >
//         ಕನ್ನಡ
//       </button>
//     </div>
//   );
// };

// export default Translator;


// Translator.tsx
import { useTranslation } from '../context/TranslationContext';
import { useState, useEffect } from 'react';

const Translator = () => {
  const { currentLanguage, setLanguage, isTransitioning } = useTranslation();
  const [delayedActive, setDelayedActive] = useState(false);

  // Handle the 1000ms delay for active classes
  useEffect(() => {
    if (!isTransitioning) {
      // When transition ends, wait 1000ms before applying active styles
      const timer = setTimeout(() => {
        setDelayedActive(true);
      }, 400);
      
      return () => clearTimeout(timer);
    } else {
      // Reset when transitioning starts
      setDelayedActive(false);
    }
  }, [isTransitioning]);

  const getButtonClasses = (isActive: boolean) => {
    const baseClasses = "px-3 py-1 text-white rounded text-sm transition-all duration-300 ease-in-out transform";
    const activeClasses = delayedActive ? "btn-gradient scale-105 shadow-lg" : "primary-gradient hover:scale-102";
    const inactiveClasses = "primary-gradient hover:scale-102";
    const disabledClasses = isTransitioning ? "opacity-70 cursor-not-allowed" : "cursor-pointer";
    
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${disabledClasses}`;
  };

  const handleLanguageChange = (lang: "en" | "hi" | "mr" | "kn") => {
    if (!isTransitioning && lang !== currentLanguage) {
      setLanguage(lang);
    }
  };

  return (
    <div className="flex gap-2 p-2 bg-white/80 backdrop-blur-sm rounded-bl-lg shadow-md">
      <button
        className={getButtonClasses(currentLanguage === 'en')}
        onClick={() => handleLanguageChange("en")}
        disabled={isTransitioning}
      >
        English
      </button>
      <button
        className={getButtonClasses(currentLanguage === 'hi')}
        onClick={() => handleLanguageChange("hi")}
        disabled={isTransitioning}
      >
        हिंदी
      </button>
      <button
        className={getButtonClasses(currentLanguage === 'mr')}
        onClick={() => handleLanguageChange("mr")}
        disabled={isTransitioning}
      >
        मराठी
      </button>
      <button
        className={getButtonClasses(currentLanguage === 'kn')}
        onClick={() => handleLanguageChange("kn")}
        disabled={isTransitioning}
      >
        ಕನ್ನಡ
      </button>
      
      {isTransitioning && (
        <div className="flex items-center ml-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default Translator;