import React, { createContext, useContext, useState, useEffect } from 'react';

const I18nContext = createContext();

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

// Translation data
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.uiBuilder': 'UI Builder',
    'nav.analytics': 'Analytics',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.create': 'Create',
    'common.update': 'Update',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.warning': 'Warning',
    'common.info': 'Information',
    'common.close': 'Close',
    'common.open': 'Open',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.download': 'Download',
    'common.upload': 'Upload',
    'common.copy': 'Copy',
    'common.paste': 'Paste',
    'common.cut': 'Cut',
    'common.undo': 'Undo',
    'common.redo': 'Redo',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.ok': 'OK',
    
    // Authentication
    'auth.login': 'Login',
    'auth.logout': 'Logout',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.rememberMe': 'Remember Me',
    'auth.createAccount': 'Create Account',
    'auth.welcomeBack': 'Welcome Back',
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    
    // UI Builder
    'uiBuilder.title': 'UI Builder',
    'uiBuilder.components': 'Components',
    'uiBuilder.templates': 'Templates',
    'uiBuilder.properties': 'Properties',
    'uiBuilder.preview': 'Preview',
    'uiBuilder.save': 'Save Project',
    'uiBuilder.load': 'Load Project',
    'uiBuilder.export': 'Export',
    'uiBuilder.undo': 'Undo',
    'uiBuilder.redo': 'Redo',
    
    // Theme
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.ocean': 'Ocean',
    'theme.sunset': 'Sunset',
    'theme.system': 'System',
    
    // Time and Date
    'time.now': 'Now',
    'time.today': 'Today',
    'time.yesterday': 'Yesterday',
    'time.tomorrow': 'Tomorrow',
    'time.thisWeek': 'This Week',
    'time.lastWeek': 'Last Week',
    'time.thisMonth': 'This Month',
    'time.lastMonth': 'Last Month',
    
    // Numbers and Currency
    'number.thousand': 'K',
    'number.million': 'M',
    'number.billion': 'B',
    'currency.symbol': '$',
    
    // File sizes
    'fileSize.bytes': 'Bytes',
    'fileSize.kb': 'KB',
    'fileSize.mb': 'MB',
    'fileSize.gb': 'GB',
    
    // Messages
    'message.saveSuccess': 'Saved successfully',
    'message.saveError': 'Failed to save',
    'message.deleteConfirm': 'Are you sure you want to delete this item?',
    'message.noData': 'No data available',
    'message.networkError': 'Network error occurred',
  },
  
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.about': 'Acerca de',
    'nav.contact': 'Contacto',
    'nav.uiBuilder': 'Constructor UI',
    'nav.analytics': 'Analíticas',
    
    // Common
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.create': 'Crear',
    'common.update': 'Actualizar',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.warning': 'Advertencia',
    'common.info': 'Información',
    'common.close': 'Cerrar',
    'common.open': 'Abrir',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.sort': 'Ordenar',
    'common.export': 'Exportar',
    'common.import': 'Importar',
    'common.download': 'Descargar',
    'common.upload': 'Subir',
    'common.copy': 'Copiar',
    'common.paste': 'Pegar',
    'common.cut': 'Cortar',
    'common.undo': 'Deshacer',
    'common.redo': 'Rehacer',
    'common.yes': 'Sí',
    'common.no': 'No',
    'common.ok': 'OK',
    
    // Authentication
    'auth.login': 'Iniciar Sesión',
    'auth.logout': 'Cerrar Sesión',
    'auth.register': 'Registrarse',
    'auth.email': 'Correo Electrónico',
    'auth.password': 'Contraseña',
    'auth.confirmPassword': 'Confirmar Contraseña',
    'auth.forgotPassword': '¿Olvidaste tu contraseña?',
    'auth.rememberMe': 'Recordarme',
    'auth.createAccount': 'Crear Cuenta',
    'auth.welcomeBack': 'Bienvenido de Nuevo',
    'auth.signIn': 'Iniciar Sesión',
    'auth.signUp': 'Registrarse',
    
    // Theme
    'theme.light': 'Claro',
    'theme.dark': 'Oscuro',
    'theme.ocean': 'Océano',
    'theme.sunset': 'Atardecer',
    'theme.system': 'Sistema',
    
    // Currency
    'currency.symbol': '€',
  },
  
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.about': 'À Propos',
    'nav.contact': 'Contact',
    'nav.uiBuilder': 'Constructeur UI',
    'nav.analytics': 'Analytiques',
    
    // Common
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.create': 'Créer',
    'common.update': 'Mettre à jour',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.warning': 'Avertissement',
    'common.info': 'Information',
    'common.close': 'Fermer',
    'common.open': 'Ouvrir',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.sort': 'Trier',
    'common.export': 'Exporter',
    'common.import': 'Importer',
    'common.download': 'Télécharger',
    'common.upload': 'Téléverser',
    'common.copy': 'Copier',
    'common.paste': 'Coller',
    'common.cut': 'Couper',
    'common.undo': 'Annuler',
    'common.redo': 'Refaire',
    'common.yes': 'Oui',
    'common.no': 'Non',
    'common.ok': 'OK',
    
    // Authentication
    'auth.login': 'Connexion',
    'auth.logout': 'Déconnexion',
    'auth.register': 'S\'inscrire',
    'auth.email': 'E-mail',
    'auth.password': 'Mot de passe',
    'auth.confirmPassword': 'Confirmer le mot de passe',
    'auth.forgotPassword': 'Mot de passe oublié?',
    'auth.rememberMe': 'Se souvenir de moi',
    'auth.createAccount': 'Créer un compte',
    'auth.welcomeBack': 'Bon retour',
    'auth.signIn': 'Se connecter',
    'auth.signUp': 'S\'inscrire',
    
    // Theme
    'theme.light': 'Clair',
    'theme.dark': 'Sombre',
    'theme.ocean': 'Océan',
    'theme.sunset': 'Coucher de soleil',
    'theme.system': 'Système',
    
    // Currency
    'currency.symbol': '€',
  },
  
  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.about': 'Über uns',
    'nav.contact': 'Kontakt',
    'nav.uiBuilder': 'UI-Builder',
    'nav.analytics': 'Analytik',
    
    // Common
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.delete': 'Löschen',
    'common.edit': 'Bearbeiten',
    'common.create': 'Erstellen',
    'common.update': 'Aktualisieren',
    'common.loading': 'Laden...',
    'common.error': 'Fehler',
    'common.success': 'Erfolg',
    'common.warning': 'Warnung',
    'common.info': 'Information',
    'common.close': 'Schließen',
    'common.open': 'Öffnen',
    'common.search': 'Suchen',
    'common.filter': 'Filtern',
    'common.sort': 'Sortieren',
    'common.export': 'Exportieren',
    'common.import': 'Importieren',
    'common.download': 'Herunterladen',
    'common.upload': 'Hochladen',
    'common.copy': 'Kopieren',
    'common.paste': 'Einfügen',
    'common.cut': 'Ausschneiden',
    'common.undo': 'Rückgängig',
    'common.redo': 'Wiederholen',
    'common.yes': 'Ja',
    'common.no': 'Nein',
    'common.ok': 'OK',
    
    // Authentication
    'auth.login': 'Anmelden',
    'auth.logout': 'Abmelden',
    'auth.register': 'Registrieren',
    'auth.email': 'E-Mail',
    'auth.password': 'Passwort',
    'auth.confirmPassword': 'Passwort bestätigen',
    'auth.forgotPassword': 'Passwort vergessen?',
    'auth.rememberMe': 'Angemeldet bleiben',
    'auth.createAccount': 'Konto erstellen',
    'auth.welcomeBack': 'Willkommen zurück',
    'auth.signIn': 'Anmelden',
    'auth.signUp': 'Registrieren',
    
    // Theme
    'theme.light': 'Hell',
    'theme.dark': 'Dunkel',
    'theme.ocean': 'Ozean',
    'theme.sunset': 'Sonnenuntergang',
    'theme.system': 'System',
    
    // Currency
    'currency.symbol': '€',
  }
};

// Language configurations
const languageConfigs = {
  en: {
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: 'USD'
    }
  },
  es: {
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    numberFormat: {
      decimal: ',',
      thousands: '.',
      currency: 'EUR'
    }
  },
  fr: {
    name: 'French',
    nativeName: 'Français',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    numberFormat: {
      decimal: ',',
      thousands: ' ',
      currency: 'EUR'
    }
  },
  de: {
    name: 'German',
    nativeName: 'Deutsch',
    direction: 'ltr',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: '24h',
    numberFormat: {
      decimal: ',',
      thousands: '.',
      currency: 'EUR'
    }
  }
};

export const I18nProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isRTL, setIsRTL] = useState(false);

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 
                         navigator.language.split('-')[0] || 'en';
    
    if (translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Update RTL direction
  useEffect(() => {
    const config = languageConfigs[currentLanguage];
    setIsRTL(config?.direction === 'rtl');
    
    // Update document direction
    document.documentElement.dir = config?.direction || 'ltr';
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  // Change language
  const changeLanguage = (language) => {
    if (translations[language]) {
      setCurrentLanguage(language);
      localStorage.setItem('language', language);
    }
  };

  // Get translation
  const t = (key, params = {}) => {
    const keys = key.split('.');
    let translation = translations[currentLanguage];
    
    for (const k of keys) {
      translation = translation?.[k];
    }
    
    // Fallback to English if translation not found
    if (!translation) {
      let fallback = translations.en;
      for (const k of keys) {
        fallback = fallback?.[k];
      }
      translation = fallback || key;
    }
    
    // Replace parameters
    if (typeof translation === 'string' && Object.keys(params).length > 0) {
      return translation.replace(/\{\{(\w+)\}\}/g, (match, param) => {
        return params[param] || match;
      });
    }
    
    return translation || key;
  };

  // Format number according to locale
  const formatNumber = (number, options = {}) => {
    const config = languageConfigs[currentLanguage];
    
    try {
      return new Intl.NumberFormat(currentLanguage, {
        ...options,
        ...config.numberFormat
      }).format(number);
    } catch (error) {
      return number.toString();
    }
  };

  // Format currency
  const formatCurrency = (amount, currency) => {
    const config = languageConfigs[currentLanguage];
    
    try {
      return new Intl.NumberFormat(currentLanguage, {
        style: 'currency',
        currency: currency || config.numberFormat.currency
      }).format(amount);
    } catch (error) {
      const symbol = translations[currentLanguage]['currency.symbol'] || '$';
      return `${symbol}${amount}`;
    }
  };

  // Format date
  const formatDate = (date, options = {}) => {
    try {
      return new Intl.DateTimeFormat(currentLanguage, options).format(new Date(date));
    } catch (error) {
      return new Date(date).toLocaleDateString();
    }
  };

  // Format relative time
  const formatRelativeTime = (date) => {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInSeconds = Math.floor((now - targetDate) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };
    
    for (const [unit, seconds] of Object.entries(intervals)) {
      const interval = Math.floor(diffInSeconds / seconds);
      
      if (interval >= 1) {
        try {
          return new Intl.RelativeTimeFormat(currentLanguage, { numeric: 'auto' })
            .format(-interval, unit);
        } catch (error) {
          return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
        }
      }
    }
    
    return t('time.now');
  };

  // Get available languages
  const getAvailableLanguages = () => {
    return Object.entries(languageConfigs).map(([code, config]) => ({
      code,
      name: config.name,
      nativeName: config.nativeName
    }));
  };

  // Get current language config
  const getCurrentLanguageConfig = () => {
    return languageConfigs[currentLanguage];
  };

  const value = {
    currentLanguage,
    isRTL,
    changeLanguage,
    t,
    formatNumber,
    formatCurrency,
    formatDate,
    formatRelativeTime,
    getAvailableLanguages,
    getCurrentLanguageConfig
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export default I18nContext;
