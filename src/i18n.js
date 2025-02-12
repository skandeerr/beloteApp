import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    fr: {
      translation: {
        belote: "Belote",
        rebelote: "Rebelote",
        kabboute: "Kabboute",
        points: "points",
        suits: {
          hearts: "Cœur",
          diamonds: "Carreau",
          clubs: "Trèfle",
          spades: "Pique"
        },
        announcements: {
          belote: "Belote! (20 points)",
          kabboute: "Kabboute {{value}} points"
        }
      }
    }
  },
  lng: 'fr',
  fallbackLng: 'fr',
});

export default i18n;