import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'ro' | 'de' | 'en' | 'fr';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'ro',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'axe-mobilier-language',
    }
  )
);

export const translations = {
  ro: {
    nav: {
      home: 'Acasă',
      products: 'Produsele Noastre',
      projects: 'Realizări',
      contact: 'Contact',
    },
    hero: {
      title: 'Specialistul dumneavoastră în mobilier profesional și amenajări interioare',
      cta: 'Descoperiți produsele noastre',
    },
    projects: {
      title: 'Realizările Noastre',
      categories: {
        kitchens: 'Bucătăriile Noastre',
        bathrooms: 'Băi',
        misc: 'Diverse',
      },
    },
    contact: {
      title: 'Contactați-ne',
      form: {
        name: 'Nume',
        email: 'Email',
        message: 'Mesaj',
        send: 'Trimite',
      },
      phone: 'Telefon',
      address: 'Adresă',
    },
    footer: {
      quickLinks: 'Link-uri Rapide',
      reference: 'Referința dumneavoastră din 2003 pentru un serviciu de calitate.',
      rights: 'Toate drepturile rezervate.',
    },
  },
  de: {
    nav: {
      home: 'Startseite',
      products: 'Unsere Produkte',
      projects: 'Projekte',
      contact: 'Kontakt',
    },
    hero: {
      title: 'Ihr Spezialist für professionelle Möbel und Inneneinrichtung',
      cta: 'Entdecken Sie unsere Produkte',
    },
    projects: {
      title: 'Unsere Projekte',
      categories: {
        kitchens: 'Unsere Küchen',
        bathrooms: 'Badezimmer',
        misc: 'Sonstiges',
      },
    },
    contact: {
      title: 'Kontaktieren Sie uns',
      form: {
        name: 'Name',
        email: 'E-Mail',
        message: 'Nachricht',
        send: 'Senden',
      },
      phone: 'Telefon',
      address: 'Adresse',
    },
    footer: {
      quickLinks: 'Schnelllinks',
      reference: 'Ihre Referenz seit 2003 für Qualitätsservice.',
      rights: 'Alle Rechte vorbehalten.',
    },
  },
  en: {
    nav: {
      home: 'Home',
      products: 'Our Products',
      projects: 'Projects',
      contact: 'Contact',
    },
    hero: {
      title: 'Your specialist in professional furniture and interior design',
      cta: 'Discover our products',
    },
    projects: {
      title: 'Our Projects',
      categories: {
        kitchens: 'Our Kitchens',
        bathrooms: 'Bathrooms',
        misc: 'Miscellaneous',
      },
    },
    contact: {
      title: 'Contact Us',
      form: {
        name: 'Name',
        email: 'Email',
        message: 'Message',
        send: 'Send',
      },
      phone: 'Phone',
      address: 'Address',
    },
    footer: {
      quickLinks: 'Quick Links',
      reference: 'Your reference since 2003 for quality service.',
      rights: 'All rights reserved.',
    },
  },
  fr: {
    nav: {
      home: 'Accueil',
      products: 'Nos Produits',
      projects: 'Réalisations',
      contact: 'Contact',
    },
    hero: {
      title: 'Votre spécialiste en mobilier professionnel et aménagement d\'espaces',
      cta: 'Découvrir nos produits',
    },
    projects: {
      title: 'Nos Réalisations',
      categories: {
        kitchens: 'Nos Cuisines',
        bathrooms: 'Salles de Bains',
        misc: 'Divers',
      },
    },
    contact: {
      title: 'Contactez-nous',
      form: {
        name: 'Nom',
        email: 'Email',
        message: 'Message',
        send: 'Envoyer',
      },
      phone: 'Téléphone',
      address: 'Adresse',
    },
    footer: {
      quickLinks: 'Liens Rapides',
      reference: 'Votre référence depuis 2003 pour un service de qualité.',
      rights: 'Tous droits réservés.',
    },
  },
} as const;