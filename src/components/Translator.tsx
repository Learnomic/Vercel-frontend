// // import { useEffect, useState } from "react";

// // declare global {
// //   interface Window {
// //     google: any;
// //     googleTranslateElementInit: () => void;
// //   }
// // }

// // const Translator = () => {
// //   const [initialized, setInitialized] = useState(false);

// //   const googleTranslateElementInit = () => {
// //     new window.google.translate.TranslateElement(
// //       {
// //         pageLanguage: "en",
// //         autoDisplay: false,
// //         includedLanguages: "en,hi,mr",
// //         layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
// //       },
// //       "google_translate_element"
// //     );
    
// //     // Hide Google top bar
// //     setTimeout(() => {
// //       const googleFrame = document.querySelector('.goog-te-banner-frame');
// //       if (googleFrame) {
// //         googleFrame.setAttribute('style', 'display: none !important');
// //       }
// //       document.body.style.top = '0px';
// //     }, 300);
    
// //     setInitialized(true);
// //   };

// //   useEffect(() => {
// //     // Add CSS to hide the Google bar
// //     const style = document.createElement('style');
// //     style.textContent = `
// //       .goog-te-banner-frame {
// //         display: none !important;
// //       }
// //       .goog-te-menu-value:hover {
// //         text-decoration: none !important;
// //       }
// //       body {
// //         top: 0 !important;
// //       }
// //       .skiptranslate {
// //         display: none !important;
// //       }
// //     `;
// //     document.head.appendChild(style);

// //     const addScript = document.createElement("script");
// //     addScript.setAttribute(
// //       "src",
// //       "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
// //     );
// //     document.body.appendChild(addScript);
// //     window.googleTranslateElementInit = googleTranslateElementInit;
// //   }, []);

// //   // Custom function to change language without refreshing
// //   const handleLanguageChange = (lang: string) => {
// //     const selectField = document.querySelector('.goog-te-combo') as HTMLSelectElement;
// //     if (selectField) {
// //       selectField.value = lang;
// //       selectField.dispatchEvent(new Event('change'));
// //     } else {
// //       // Fallback to cookie approach
// //       const cookieLangMap: { [key: string]: string } = {
// //         en: "en",
// //         hi: "hi",
// //         mr: "mr"
// //       };
// //       document.cookie = `googtrans=/en/${cookieLangMap[lang]};path=/;domain=${window.location.hostname}`;
// //       window.location.reload();
// //     }
// //   };

// //   return (
// //     <>
// //       {/* Hide Google default widget */}
// //       <div id="google_translate_element" className="hidden" />

// //       {/* Custom buttons */}
// //       <div className="flex gap-4 p-4">
// //         <button
// //           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
// //           onClick={() => handleLanguageChange("en")}
// //         >
// //           English
// //         </button>
// //         <button
// //           className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
// //           onClick={() => handleLanguageChange("hi")}
// //         >
// //           हिंदी
// //         </button>
// //         <button
// //           className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
// //           onClick={() => handleLanguageChange("mr")}
// //         >
// //           मराठी
// //         </button>
// //       </div>

// //       <h4 className="text-xl font-semibold p-4">
// //         Start building your app. Happy Coding!
// //       </h4>
// //     </>
// //   );
// // };

// // export default Translator;


// import { useEffect, useState } from "react";

// declare global {
//   interface Window {
//     google: any;
//     googleTranslateElementInit: () => void;
//   }
// }

// const Translator = () => {
//   const [initialized, setInitialized] = useState(false);

//   const googleTranslateElementInit = () => {
//     new window.google.translate.TranslateElement(
//       {
//         pageLanguage: "en",
//         autoDisplay: false,
//         includedLanguages: "en,hi,mr",
//         layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
//       },
//       "google_translate_element"
//     );
    
//     // Hide Google top bar
//     setTimeout(() => {
//       const googleFrame = document.querySelector('.goog-te-banner-frame');
//       if (googleFrame) {
//         googleFrame.setAttribute('style', 'display: none !important');
//       }
//       document.body.style.top = '50px';
//     }, 300);
    
//     setInitialized(true);
//   };

//   useEffect(() => {
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

//     const addScript = document.createElement("script");
//     addScript.setAttribute(
//       "src",
//       "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
//     );
//     document.body.appendChild(addScript);
//     window.googleTranslateElementInit = googleTranslateElementInit;
//   }, []);

//   // Custom function to change language without refreshing
//   const handleLanguageChange = (lang: string) => {
//     const selectField = document.querySelector('.goog-te-combo') as HTMLSelectElement;
//     if (selectField) {
//       selectField.value = lang;
//       selectField.dispatchEvent(new Event('change'));
//     } else {
//       // Fallback to cookie approach
//       const cookieLangMap: { [key: string]: string } = {
//         en: "en",
//         hi: "hi",
//         mr: "mr"
//       };
//       document.cookie = `googtrans=/en/${cookieLangMap[lang]};path=/;domain=${window.location.hostname}`;
//       window.location.reload();
//     }
//   };

//   return (
//     <>
//       {/* Hide Google default widget */}
//       <div id="google_translate_element" className="hidden" />

//       {/* Custom buttons - styled for top right positioning */}
//       <div className="flex gap-2 p-2 bg-white/80 backdrop-blur-sm rounded-bl-lg shadow-md">
//         <button
//           className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
//           onClick={() => handleLanguageChange("en")}
//         >
//           English
//         </button>
//         <button
//           className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
//           onClick={() => handleLanguageChange("hi")}
//         >
//           हिंदी
//         </button>
//         <button
//           className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 transition-colors"
//           onClick={() => handleLanguageChange("mr")}
//         >
//           मराठी
//         </button>
//       </div>
//     </>
//   );
// };

// export default Translator;




// Translator.tsx
import { useTranslation } from '../context/TranslationContext';

const Translator = () => {
  const { currentLanguage, setLanguage } = useTranslation();

  return (
    <div className="flex gap-2 p-2 bg-white/80 backdrop-blur-sm rounded-bl-lg shadow-md">
      <button
        className={`px-3 py-1 ${currentLanguage === 'en' ? 'btn-gradient' : 'text-white border-solid border-[primary-gradient] primary-gradient b-[primary-gradient] '} text-white rounded text-sm hover:primary-gradient transition-colors`}
        onClick={() => setLanguage("en")}
      >
        English
      </button>
      <button
        className={`px-3 py-1 ${currentLanguage === 'hi' ? 'btn-gradient' : 'primary-gradient'} text-white rounded text-sm hover:bg-green-600 transition-colors`}
        onClick={() => setLanguage("hi")}
      >
        हिंदी
      </button>
      <button
        className={`px-3 py-1 ${currentLanguage === 'mr' ? 'btn-gradient' : 'primary-gradient'} text-white rounded text-sm hover:bg-yellow-600 transition-colors`}
        onClick={() => setLanguage("mr")}
      >
        मराठी
      </button>
      <button
        className={`px-3 py-1 ${currentLanguage === 'kn' ? 'btn-gradient' : 'primary-gradient'} text-white rounded text-sm hover:bg-yellow-600 transition-colors`}
        onClick={() => setLanguage("kn")}
      >
        ಕನ್ನಡ
      </button>
    </div>
  );
};

export default Translator;