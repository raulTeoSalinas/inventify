import EN from './strings/EN.json'
import ES from './strings/ES.json'

interface TranslationsType {
  EN: Record<string, string>;
  ES: Record<string, string>;
}

export const translations: TranslationsType = {
  EN,
  ES
};