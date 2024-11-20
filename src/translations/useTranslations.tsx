// Internal Dependencies
import { useAppSelector } from "../store/hooks";
import { translations } from "./translations";

const useTranslations = () => {
  const language = useAppSelector((state) => state.config.language) || 'EN';
  const translate = (key: string, variables?: { [key: string]: (string | number) }): string => {
    let translation = translations[language][key] || key;
    // Replace placeholders (e.g., {{name}}) with the corresponding values from the variables object
    if (variables) {
      Object.keys(variables).forEach((variableKey) => {
        const regex = new RegExp(`{{${variableKey}}}`, 'g');
        translation = translation.replace(regex, String(variables[variableKey]));
      });
    }

    return translation;
  };

  return translate;
};

export default useTranslations;