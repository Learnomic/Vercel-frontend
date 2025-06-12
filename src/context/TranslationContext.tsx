// // TranslationContext.tsx
// import React, { createContext, useContext, useState, useEffect } from 'react';

// type Language = "en" | "hi" | "mr" | "kn";

// interface TranslationContextType {
//   currentLanguage: Language;
//   setLanguage: (lang: Language) => void;
// }

// const TranslationContext = createContext<TranslationContextType>({
//   currentLanguage: "en",
//   setLanguage: () => {}
// });

// export const useTranslation = () => useContext(TranslationContext);

// declare global {
//   interface Window {
//     google: any;
//     googleTranslateElementInit: () => void;
//   }
// }

// export const TranslationProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
//   const [currentLanguage, setCurrentLanguage] = useState<Language>("en");
//   const [initialized, setInitialized] = useState(false);

//   const initTranslator = () => {
//     // Add CSS to hide the Google bar
//     const style = document.createElement('style');
//     style.textContent = `
//       .goog-te-banner-frame {
//         display: none !important;
//       }
//       .goog-te-menu-value:hover {
//         text-decoration: none !important;
//       }
//       body {
//         top: 0 !important;
//       }
//       .skiptranslate {
//         display: none !important;
//       }
//     `;
//     document.head.appendChild(style);

//     // Create the translation element
//     const translateElement = document.createElement('div');
//     translateElement.id = 'google_translate_element';
//     translateElement.style.display = 'none';
//     document.body.appendChild(translateElement);

//     window.googleTranslateElementInit = () => {
//       new window.google.translate.TranslateElement(
//         {
//           pageLanguage: "en",
//           autoDisplay: false,
//           includedLanguages: "en,hi,mr,kn",
//           layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
//         },
//         "google_translate_element"
//       );
      
//       // Get the current language from cookie if exists
//       const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
//       if (match && match[1]) {
//         setCurrentLanguage(match[1] as Language);
//       }
      
//       setInitialized(true);
      
//       // Hide Google top bar
//       setTimeout(hideTopBar, 300);
//     };

//     const script = document.createElement("script");
//     script.setAttribute(
//       "src",
//       "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
//     );
//     document.body.appendChild(script);
//   };

//   const hideTopBar = () => {
//     const googleFrame = document.querySelector('.goog-te-banner-frame');
//     if (googleFrame) {
//       googleFrame.setAttribute('style', 'display: none !important');
//     }
//     document.body.style.top = '0px';
//   };

//   useEffect(() => {
//     if (!initialized) {
//       initTranslator();
//     }
    
//     // Add MutationObserver to continuously hide the top bar
//     const observer = new MutationObserver(() => {
//       hideTopBar();
//     });
    
//     observer.observe(document.body, { 
//       childList: true,
//       subtree: true
//     });
    
//     return () => observer.disconnect();
//   }, [initialized]);

//   const setLanguage = (lang: Language) => {
//     setCurrentLanguage(lang);
    
//     if (initialized) {
//       const selectField = document.querySelector('.goog-te-combo') as HTMLSelectElement;
//       if (selectField) {
//         selectField.value = lang;
//         selectField.dispatchEvent(new Event('change'));
//       } else {
//         // Fallback to cookie approach
//         document.cookie = `googtrans=/en/${lang};path=/;domain=${window.location.hostname}`;
//         window.location.reload();
//       }
      
//       // Ensure the top bar stays hidden
//       setTimeout(hideTopBar, 300);
//     }
//   };

//   return (
//     <TranslationContext.Provider value={{ currentLanguage, setLanguage }}>
//       {children}
//     </TranslationContext.Provider>
//   );
// };


import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = "en" | "hi" | "mr" | "kn";

interface TranslationContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  isTransitioning: boolean; // Add this line
}

const TranslationContext = createContext<TranslationContextType>({
  currentLanguage: "en",
  setLanguage: () => {},
  isTransitioning: false // Add this line
});

export const useTranslation = () => useContext(TranslationContext);

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

export const TranslationProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");
  const [initialized, setInitialized] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false); // Add this line

  const initTranslator = () => {
    // Add CSS to hide the Google bar
    const style = document.createElement('style');
    style.textContent = `
      .goog-te-banner-frame {
        display: none !important;
      }
      .goog-te-menu-value:hover {
        text-decoration: none !important;
      }
      body {
        top: 0 !important;
      }
      .skiptranslate {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    // Create the translation element
    const translateElement = document.createElement('div');
    translateElement.id = 'google_translate_element';
    translateElement.style.display = 'none';
    document.body.appendChild(translateElement);

    window.googleTranslateElementInit = () => {
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            autoDisplay: false,
            includedLanguages: "en,hi,mr,kn",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
          },
          "google_translate_element"
        );
        
        // Get the current language from cookie if exists
        const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
        if (match && match[1]) {
          setCurrentLanguage(match[1] as Language);
        }
        
        setInitialized(true);
        
        // Hide Google top bar
        setTimeout(hideTopBar, 300);
      } catch (error) {
        console.error('Error initializing Google Translate:', error);
        // Retry initialization after a delay
        setTimeout(() => {
          if (!initialized) {
            initTranslator();
          }
        }, 2000);
      }
    };

    const script = document.createElement("script");
    script.setAttribute(
      "src",
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    );
    script.async = true;
    script.onerror = () => {
      console.error('Failed to load Google Translate script');
      // Retry loading the script after a delay
      setTimeout(() => {
        if (!initialized) {
          initTranslator();
        }
      }, 2000);
    };
    document.body.appendChild(script);
  };

  const hideTopBar = () => {
    const googleFrame = document.querySelector('.goog-te-banner-frame');
    if (googleFrame) {
      googleFrame.setAttribute('style', 'display: none !important');
    }
    document.body.style.top = '0px';
  };

  useEffect(() => {
    if (!initialized) {
      initTranslator();
    }
    
    // Add MutationObserver to continuously hide the top bar
    const observer = new MutationObserver(() => {
      hideTopBar();
    });
    
    observer.observe(document.body, { 
      childList: true,
      subtree: true
    });
    
    return () => observer.disconnect();
  }, [initialized]);
const setLanguage = (lang: Language) => {
  setIsTransitioning(true);
  setCurrentLanguage(lang);

  const maxRetries = 20;
  let attempts = 0;

  const trySetLanguage = () => {
    const selectField = document.querySelector('.goog-te-combo') as HTMLSelectElement;

    if (selectField) {
      const hasLang = Array.from(selectField.options).some(option => option.value === lang);

      if (hasLang) {
        // Set cookie to force Google Translate to recognize the change
        document.cookie = googtrans=/en/${lang};path=/;domain=${window.location.hostname};

        // Update dropdown
        selectField.value = lang;
        selectField.dispatchEvent(new Event('change'));

        setTimeout(() => {
          setIsTransitioning(false);
          hideTopBar();
        }, 1000);

        return;
      }
    }

    // Retry logic
    attempts++;
    if (attempts < maxRetries) {
      setTimeout(trySetLanguage, 200);
    } else {
      console.warn(Failed to switch to language: ${lang}.);
      setIsTransitioning(false);
    }
  };

  trySetLanguage();
};

  return (
    <TranslationContext.Provider value={{ currentLanguage, setLanguage, isTransitioning }}>
      {children}
    </TranslationContext.Provider>
  );
};