
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
    </div>
  );
};

export default Translator;