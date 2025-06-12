//TranslationContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = "en" | "hi" | "mr" | "kn";

interface TranslationContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  isTransitioning: boolean;
  translationReady: boolean; // Add this to track if translation is ready
}

const TranslationContext = createContext<TranslationContextType>({
  currentLanguage: "en",
  setLanguage: () => {},
  isTransitioning: false,
  translationReady: false
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [translationReady, setTranslationReady] = useState(false);

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
      .goog-te-spinner-pos {
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
            // Use full language codes for better support
            includedLanguages: "en,hi,mr,kn",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            multilanguagePage: true, // Enable multilanguage support
            gaTrack: false, // Disable Google Analytics tracking
            gaId: null
          },
          "google_translate_element"
        );
       
        // Wait for the translator to be fully loaded
        const checkTranslatorReady = () => {
          const selectField = document.querySelector('.goog-te-combo') as HTMLSelectElement;
          if (selectField && selectField.options.length > 1) {
            setTranslationReady(true);
           
            // Get the current language from cookie if exists
            const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
            if (match && match[1]) {
              setCurrentLanguage(match[1] as Language);
            }
           
            setInitialized(true);
            console.log('Google Translate initialized successfully');
           
            // Verify language support
            verifyLanguageSupport();
          } else {
            setTimeout(checkTranslatorReady, 200);
          }
        };
       
        checkTranslatorReady();
       
        // Hide Google top bar periodically
        const hideBarInterval = setInterval(hideTopBar, 500);
        setTimeout(() => clearInterval(hideBarInterval), 5000);
       
      } catch (error) {
        console.error('Error initializing Google Translate:', error);
        // Retry initialization after a delay
        setTimeout(() => {
          if (!initialized) {
            initTranslator();
          }
        }, 3000);
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
      }, 3000);
    };
    document.body.appendChild(script);
  };

  const verifyLanguageSupport = () => {
    const selectField = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectField) {
      const supportedLanguages = Array.from(selectField.options).map(option => option.value);
      console.log('Supported languages:', supportedLanguages);
     
      // Check if Marathi and Kannada are supported
      const marathiSupported = supportedLanguages.includes('mr');
      const kannadaSupported = supportedLanguages.includes('kn');
     
      if (!marathiSupported) {
        console.warn('Marathi (mr) is not supported by Google Translate');
      }
      if (!kannadaSupported) {
        console.warn('Kannada (kn) is not supported by Google Translate');
      }
    }
  };

  const hideTopBar = () => {
    const googleFrame = document.querySelector('.goog-te-banner-frame');
    if (googleFrame) {
      googleFrame.setAttribute('style', 'display: none !important');
    }
   
    const topFrame = document.querySelector('iframe.goog-te-banner-frame');
    if (topFrame) {
      topFrame.setAttribute('style', 'display: none !important');
    }
   
    document.body.style.top = '0px';
    document.body.style.position = 'static';
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

  const setLanguage = async (lang: Language) => {
    if (!translationReady) {
      console.warn('Translation not ready yet');
      return;
    }

    setIsTransitioning(true);
    setCurrentLanguage(lang);
   
    try {
      const selectField = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectField) {
        // Verify the language is available in the dropdown
        const option = Array.from(selectField.options).find(opt => opt.value === lang);
        if (!option) {
          console.error(`Language ${lang} not found in Google Translate options`);
          setIsTransitioning(false);
          return;
        }

        console.log(`Switching to language: ${lang}`);
        selectField.value = lang;
       
        // Create and dispatch change event
        const changeEvent = new Event('change', { bubbles: true });
        selectField.dispatchEvent(changeEvent);
       
        // Also try triggering with more event types for better compatibility
        const inputEvent = new Event('input', { bubbles: true });
        selectField.dispatchEvent(inputEvent);
       
        // Wait for translation to complete
        const waitForTranslation = () => {
          return new Promise<void>((resolve) => {
            let attempts = 0;
            const maxAttempts = 50; // 5 seconds max wait
           
            const checkTranslation = () => {
              attempts++;
             
              // Check if the page language has changed
              const currentCookie = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
              const cookieLang = currentCookie ? currentCookie[1] : 'en';
             
              if (cookieLang === lang || attempts >= maxAttempts) {
                resolve();
              } else {
                setTimeout(checkTranslation, 100);
              }
            };
           
            checkTranslation();
          });
        };
       
        await waitForTranslation();
       
        // Force a small delay to ensure translation is applied
        setTimeout(() => {
          setIsTransitioning(false);
          hideTopBar(); // Ensure top bar stays hidden
        }, 1200);
       
      } else {
        console.warn('Google Translate dropdown not found, using cookie fallback');
        // Fallback to cookie approach
        document.cookie = `googtrans=/en/${lang};path=/;domain=${window.location.hostname}`;
       
        // Force reload if cookie method is used
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch (error) {
      console.error('Error setting language:', error);
      setIsTransitioning(false);
    }
   
    // Ensure the top bar stays hidden
    setTimeout(hideTopBar, 500);
  };

  return (
    <TranslationContext.Provider value={{
      currentLanguage,
      setLanguage,
      isTransitioning,
      translationReady
    }}>
      {children}
    </TranslationContext.Provider>
  );
};