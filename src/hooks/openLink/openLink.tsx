import { Linking } from 'react-native';

export const openLink = (url: string) => {
  try {
    Linking.openURL(url);
  } catch (error) {
    console.error('Error al abrir URL:', error);
  }
};