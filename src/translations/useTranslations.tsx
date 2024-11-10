// Internal Dependencies
import { useAppSelector } from "../store/hooks";
import { translations } from "./translations";

const useTranslations = () => {
  const language = useAppSelector((state) => state.config.language) || 'EN';
  const translate = (key: string) => {
    return translations[language][key] || key;
  };
  return translate;
};

export default useTranslations;