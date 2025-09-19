/**
 * Multi-Language Support System
 * Handles internationalization and localization
 */

class MultiLanguageManager {
  constructor() {
    this.currentLanguage = 'en';
    this.supportedLanguages = {
      en: { name: 'English', nativeName: 'English', flag: '🇺🇸' },
      es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
      fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
      de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
      it: { name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
      pt: { name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
      ru: { name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
      ja: { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
      ko: { name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
      zh: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
      ar: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
      hi: { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    };

    this.translations = {
      en: {
        // Common UI Elements
        welcome: 'Welcome to AIOS',
        login: 'Login',
        logout: 'Logout',
        register: 'Register',
        email: 'Email',
        password: 'Password',
        confirm_password: 'Confirm Password',
        forgot_password: 'Forgot Password?',
        remember_me: 'Remember Me',
        submit: 'Submit',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        close: 'Close',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        warning: 'Warning',
        info: 'Information',

        // AIOS Specific
        aios_smart_agent: 'AIOS Smart Agent',
        conversation_history: 'Conversation History',
        user_preferences: 'User Preferences',
        system_status: 'System Status',
        data_analytics: 'Data Analytics',
        debug_tools: 'Debug Tools',
        learning_loop: 'Learning Loop',
        quantum_autopilot: 'Quantum Autopilot',

        // AI Responses
        ai_greeting:
          "Hello! I'm your AIOS Smart Agent. How can I help you today?",
        ai_thinking: 'Let me think about that...',
        ai_processing: 'Processing your request...',
        ai_error:
          'I apologize, but I encountered an error processing your request.',
        ai_no_data: "I don't have access to that information right now.",
        ai_suggestions: 'Here are some suggestions:',

        // System Messages
        system_online: 'System is online and running',
        system_offline: 'System is offline',
        system_maintenance: 'System is under maintenance',
        connection_lost: 'Connection lost. Attempting to reconnect...',
        reconnected: 'Reconnected successfully',

        // Notifications
        notification_new_message: 'New message received',
        notification_system_update: 'System update available',
        notification_error: 'System error detected',
        notification_success: 'Operation completed successfully',

        // Preferences
        preferences_general: 'General',
        preferences_appearance: 'Appearance',
        preferences_notifications: 'Notifications',
        preferences_privacy: 'Privacy',
        preferences_accessibility: 'Accessibility',
        preferences_language: 'Language',
        preferences_theme: 'Theme',
        preferences_font_size: 'Font Size',
        preferences_animations: 'Animations',
        preferences_sound: 'Sound Effects',

        // Themes
        theme_light: 'Light',
        theme_dark: 'Dark',
        theme_auto: 'Auto',

        // Font Sizes
        font_small: 'Small',
        font_medium: 'Medium',
        font_large: 'Large',

        // AI Personalities
        personality_helpful: 'Helpful',
        personality_professional: 'Professional',
        personality_casual: 'Casual',
        personality_technical: 'Technical',

        // Response Lengths
        response_brief: 'Brief',
        response_detailed: 'Detailed',
        response_comprehensive: 'Comprehensive',

        // Notification Frequencies
        frequency_low: 'Low',
        frequency_normal: 'Normal',
        frequency_high: 'High',

        // Accessibility
        accessibility_high_contrast: 'High Contrast',
        accessibility_screen_reader: 'Screen Reader',
        accessibility_keyboard_nav: 'Keyboard Navigation',
        accessibility_voice_commands: 'Voice Commands',

        // Error Messages
        error_invalid_email: 'Please enter a valid email address',
        error_password_too_short: 'Password must be at least 8 characters',
        error_passwords_dont_match: 'Passwords do not match',
        error_network: 'Network error. Please check your connection',
        error_server: 'Server error. Please try again later',
        error_permission: "You don't have permission to perform this action",
        error_not_found: 'The requested resource was not found',
        error_validation: 'Please check your input and try again',

        // Success Messages
        success_login: 'Login successful',
        success_logout: 'Logout successful',
        success_registration: 'Registration successful',
        success_preferences_saved: 'Preferences saved successfully',
        success_data_exported: 'Data exported successfully',
        success_data_imported: 'Data imported successfully',

        // Time and Date
        time_now: 'Now',
        time_minutes_ago: 'minutes ago',
        time_hours_ago: 'hours ago',
        time_days_ago: 'days ago',
        time_weeks_ago: 'weeks ago',
        time_months_ago: 'months ago',
        time_years_ago: 'years ago',

        // Days of Week
        day_monday: 'Monday',
        day_tuesday: 'Tuesday',
        day_wednesday: 'Wednesday',
        day_thursday: 'Thursday',
        day_friday: 'Friday',
        day_saturday: 'Saturday',
        day_sunday: 'Sunday',

        // Months
        month_january: 'January',
        month_february: 'February',
        month_march: 'March',
        month_april: 'April',
        month_may: 'May',
        month_june: 'June',
        month_july: 'July',
        month_august: 'August',
        month_september: 'September',
        month_october: 'October',
        month_november: 'November',
        month_december: 'December',
      },

      // Spanish translations
      es: {
        welcome: 'Bienvenido a AIOS',
        login: 'Iniciar Sesión',
        logout: 'Cerrar Sesión',
        register: 'Registrarse',
        email: 'Correo Electrónico',
        password: 'Contraseña',
        confirm_password: 'Confirmar Contraseña',
        forgot_password: '¿Olvidaste tu contraseña?',
        remember_me: 'Recordarme',
        submit: 'Enviar',
        cancel: 'Cancelar',
        save: 'Guardar',
        delete: 'Eliminar',
        edit: 'Editar',
        close: 'Cerrar',
        back: 'Atrás',
        next: 'Siguiente',
        previous: 'Anterior',
        loading: 'Cargando...',
        error: 'Error',
        success: 'Éxito',
        warning: 'Advertencia',
        info: 'Información',
        aios_smart_agent: 'Agente Inteligente AIOS',
        conversation_history: 'Historial de Conversaciones',
        user_preferences: 'Preferencias del Usuario',
        system_status: 'Estado del Sistema',
        data_analytics: 'Análisis de Datos',
        debug_tools: 'Herramientas de Depuración',
        learning_loop: 'Bucle de Aprendizaje',
        quantum_autopilot: 'Piloto Automático Cuántico',
        ai_greeting:
          '¡Hola! Soy tu Agente Inteligente AIOS. ¿Cómo puedo ayudarte hoy?',
        ai_thinking: 'Déjame pensar en eso...',
        ai_processing: 'Procesando tu solicitud...',
        ai_error:
          'Me disculpo, pero encontré un error al procesar tu solicitud.',
        ai_no_data: 'No tengo acceso a esa información en este momento.',
        ai_suggestions: 'Aquí tienes algunas sugerencias:',
        system_online: 'El sistema está en línea y funcionando',
        system_offline: 'El sistema está fuera de línea',
        system_maintenance: 'El sistema está en mantenimiento',
        connection_lost: 'Conexión perdida. Intentando reconectar...',
        reconnected: 'Reconectado exitosamente',
        preferences_general: 'General',
        preferences_appearance: 'Apariencia',
        preferences_notifications: 'Notificaciones',
        preferences_privacy: 'Privacidad',
        preferences_accessibility: 'Accesibilidad',
        preferences_language: 'Idioma',
        preferences_theme: 'Tema',
        preferences_font_size: 'Tamaño de Fuente',
        preferences_animations: 'Animaciones',
        preferences_sound: 'Efectos de Sonido',
        theme_light: 'Claro',
        theme_dark: 'Oscuro',
        theme_auto: 'Automático',
        font_small: 'Pequeño',
        font_medium: 'Mediano',
        font_large: 'Grande',
        personality_helpful: 'Útil',
        personality_professional: 'Profesional',
        personality_casual: 'Casual',
        personality_technical: 'Técnico',
        response_brief: 'Breve',
        response_detailed: 'Detallado',
        response_comprehensive: 'Exhaustivo',
        frequency_low: 'Bajo',
        frequency_normal: 'Normal',
        frequency_high: 'Alto',
        accessibility_high_contrast: 'Alto Contraste',
        accessibility_screen_reader: 'Lector de Pantalla',
        accessibility_keyboard_nav: 'Navegación por Teclado',
        accessibility_voice_commands: 'Comandos de Voz',
        error_invalid_email: 'Por favor ingresa una dirección de correo válida',
        error_password_too_short:
          'La contraseña debe tener al menos 8 caracteres',
        error_passwords_dont_match: 'Las contraseñas no coinciden',
        error_network: 'Error de red. Por favor verifica tu conexión',
        error_server: 'Error del servidor. Por favor intenta más tarde',
        error_permission: 'No tienes permisos para realizar esta acción',
        error_not_found: 'El recurso solicitado no fue encontrado',
        error_validation: 'Por favor verifica tu entrada e intenta de nuevo',
        success_login: 'Inicio de sesión exitoso',
        success_logout: 'Cierre de sesión exitoso',
        success_registration: 'Registro exitoso',
        success_preferences_saved: 'Preferencias guardadas exitosamente',
        success_data_exported: 'Datos exportados exitosamente',
        success_data_imported: 'Datos importados exitosamente',
        time_now: 'Ahora',
        time_minutes_ago: 'hace minutos',
        time_hours_ago: 'hace horas',
        time_days_ago: 'hace días',
        time_weeks_ago: 'hace semanas',
        time_months_ago: 'hace meses',
        time_years_ago: 'hace años',
        day_monday: 'Lunes',
        day_tuesday: 'Martes',
        day_wednesday: 'Miércoles',
        day_thursday: 'Jueves',
        day_friday: 'Viernes',
        day_saturday: 'Sábado',
        day_sunday: 'Domingo',
        month_january: 'Enero',
        month_february: 'Febrero',
        month_march: 'Marzo',
        month_april: 'Abril',
        month_may: 'Mayo',
        month_june: 'Junio',
        month_july: 'Julio',
        month_august: 'Agosto',
        month_september: 'Septiembre',
        month_october: 'Octubre',
        month_november: 'Noviembre',
        month_december: 'Diciembre',
      },

      // French translations
      fr: {
        welcome: 'Bienvenue sur AIOS',
        login: 'Connexion',
        logout: 'Déconnexion',
        register: "S'inscrire",
        email: 'E-mail',
        password: 'Mot de passe',
        confirm_password: 'Confirmer le mot de passe',
        forgot_password: 'Mot de passe oublié ?',
        remember_me: 'Se souvenir de moi',
        submit: 'Soumettre',
        cancel: 'Annuler',
        save: 'Sauvegarder',
        delete: 'Supprimer',
        edit: 'Modifier',
        close: 'Fermer',
        back: 'Retour',
        next: 'Suivant',
        previous: 'Précédent',
        loading: 'Chargement...',
        error: 'Erreur',
        success: 'Succès',
        warning: 'Avertissement',
        info: 'Information',
        aios_smart_agent: 'Agent Intelligent AIOS',
        conversation_history: 'Historique des Conversations',
        user_preferences: 'Préférences Utilisateur',
        system_status: 'État du Système',
        data_analytics: 'Analytiques des Données',
        debug_tools: 'Outils de Débogage',
        learning_loop: "Boucle d'Apprentissage",
        quantum_autopilot: 'Pilote Automatique Quantique',
        ai_greeting:
          "Bonjour ! Je suis votre Agent Intelligent AIOS. Comment puis-je vous aider aujourd'hui ?",
        ai_thinking: 'Laissez-moi réfléchir à cela...',
        ai_processing: 'Traitement de votre demande...',
        ai_error:
          "Je m'excuse, mais j'ai rencontré une erreur lors du traitement de votre demande.",
        ai_no_data: "Je n'ai pas accès à ces informations pour le moment.",
        ai_suggestions: 'Voici quelques suggestions :',
        system_online: 'Le système est en ligne et fonctionne',
        system_offline: 'Le système est hors ligne',
        system_maintenance: 'Le système est en maintenance',
        connection_lost: 'Connexion perdue. Tentative de reconnexion...',
        reconnected: 'Reconnecté avec succès',
        preferences_general: 'Général',
        preferences_appearance: 'Apparence',
        preferences_notifications: 'Notifications',
        preferences_privacy: 'Confidentialité',
        preferences_accessibility: 'Accessibilité',
        preferences_language: 'Langue',
        preferences_theme: 'Thème',
        preferences_font_size: 'Taille de Police',
        preferences_animations: 'Animations',
        preferences_sound: 'Effets Sonores',
        theme_light: 'Clair',
        theme_dark: 'Sombre',
        theme_auto: 'Automatique',
        font_small: 'Petit',
        font_medium: 'Moyen',
        font_large: 'Grand',
        personality_helpful: 'Utile',
        personality_professional: 'Professionnel',
        personality_casual: 'Décontracté',
        personality_technical: 'Technique',
        response_brief: 'Bref',
        response_detailed: 'Détaillé',
        response_comprehensive: 'Complet',
        frequency_low: 'Faible',
        frequency_normal: 'Normal',
        frequency_high: 'Élevé',
        accessibility_high_contrast: 'Haut Contraste',
        accessibility_screen_reader: "Lecteur d'Écran",
        accessibility_keyboard_nav: 'Navigation Clavier',
        accessibility_voice_commands: 'Commandes Vocales',
        error_invalid_email: 'Veuillez entrer une adresse e-mail valide',
        error_password_too_short:
          'Le mot de passe doit contenir au moins 8 caractères',
        error_passwords_dont_match: 'Les mots de passe ne correspondent pas',
        error_network: 'Erreur réseau. Veuillez vérifier votre connexion',
        error_server: 'Erreur serveur. Veuillez réessayer plus tard',
        error_permission:
          "Vous n'avez pas la permission d'effectuer cette action",
        error_not_found: "La ressource demandée n'a pas été trouvée",
        error_validation: 'Veuillez vérifier votre saisie et réessayer',
        success_login: 'Connexion réussie',
        success_logout: 'Déconnexion réussie',
        success_registration: 'Inscription réussie',
        success_preferences_saved: 'Préférences sauvegardées avec succès',
        success_data_exported: 'Données exportées avec succès',
        success_data_imported: 'Données importées avec succès',
        time_now: 'Maintenant',
        time_minutes_ago: 'il y a minutes',
        time_hours_ago: 'il y a heures',
        time_days_ago: 'il y a jours',
        time_weeks_ago: 'il y a semaines',
        time_months_ago: 'il y a mois',
        time_years_ago: 'il y a années',
        day_monday: 'Lundi',
        day_tuesday: 'Mardi',
        day_wednesday: 'Mercredi',
        day_thursday: 'Jeudi',
        day_friday: 'Vendredi',
        day_saturday: 'Samedi',
        day_sunday: 'Dimanche',
        month_january: 'Janvier',
        month_february: 'Février',
        month_march: 'Mars',
        month_april: 'Avril',
        month_may: 'Mai',
        month_june: 'Juin',
        month_july: 'Juillet',
        month_august: 'Août',
        month_september: 'Septembre',
        month_october: 'Octobre',
        month_november: 'Novembre',
        month_december: 'Décembre',
      },
    };
  }

  /**
   * Set current language
   */
  setLanguage(language) {
    if (this.supportedLanguages[language]) {
      this.currentLanguage = language;
      console.log(
        `🌍 Language set to: ${this.supportedLanguages[language].name}`
      );
      return true;
    }
    console.warn(`⚠️ Unsupported language: ${language}`);
    return false;
  }

  /**
   * Get current language
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  /**
   * Translate text
   */
  t(key, params = {}) {
    const translation =
      this.translations[this.currentLanguage]?.[key] ||
      this.translations['en'][key] ||
      key;

    // Replace parameters in translation
    let result = translation;
    Object.keys(params).forEach(param => {
      result = result.replace(`{{${param}}}`, params[param]);
    });

    return result;
  }

  /**
   * Translate multiple keys
   */
  translateMultiple(keys) {
    const result = {};
    keys.forEach(key => {
      result[key] = this.t(key);
    });
    return result;
  }

  /**
   * Get all translations for current language
   */
  getAllTranslations() {
    return this.translations[this.currentLanguage] || this.translations['en'];
  }

  /**
   * Format date according to language
   */
  formatDate(date, options = {}) {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };

    const locale = this.getLocaleFromLanguage(this.currentLanguage);
    return new Intl.DateTimeFormat(locale, {
      ...defaultOptions,
      ...options,
    }).format(date);
  }

  /**
   * Format number according to language
   */
  formatNumber(number, options = {}) {
    const locale = this.getLocaleFromLanguage(this.currentLanguage);
    return new Intl.NumberFormat(locale, options).format(number);
  }

  /**
   * Format currency according to language
   */
  formatCurrency(amount, currency = 'USD', options = {}) {
    const locale = this.getLocaleFromLanguage(this.currentLanguage);
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      ...options,
    }).format(amount);
  }

  /**
   * Get locale from language code
   */
  getLocaleFromLanguage(language) {
    const localeMap = {
      en: 'en-US',
      es: 'es-ES',
      fr: 'fr-FR',
      de: 'de-DE',
      it: 'it-IT',
      pt: 'pt-PT',
      ru: 'ru-RU',
      ja: 'ja-JP',
      ko: 'ko-KR',
      zh: 'zh-CN',
      ar: 'ar-SA',
      hi: 'hi-IN',
    };
    return localeMap[language] || 'en-US';
  }

  /**
   * Detect user language from browser
   */
  detectBrowserLanguage() {
    if (typeof navigator !== 'undefined') {
      const browserLang = navigator.language || navigator.userLanguage;
      const langCode = browserLang.split('-')[0];

      if (this.supportedLanguages[langCode]) {
        return langCode;
      }
    }
    return 'en';
  }

  /**
   * Get language direction (LTR/RTL)
   */
  getLanguageDirection(language = this.currentLanguage) {
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    return rtlLanguages.includes(language) ? 'rtl' : 'ltr';
  }

  /**
   * Load language from user preferences
   */
  async loadLanguageFromPreferences(userPreferencesManager, userId) {
    try {
      const preferences = await userPreferencesManager.getUserPreferences(
        userId
      );
      const language = preferences.language || 'en';
      this.setLanguage(language);
      return language;
    } catch (error) {
      console.error('❌ Failed to load language from preferences:', error);
      return 'en';
    }
  }

  /**
   * Save language to user preferences
   */
  async saveLanguageToPreferences(userPreferencesManager, userId, language) {
    try {
      await userPreferencesManager.updateUserLanguage(userId, language);
      this.setLanguage(language);
      return true;
    } catch (error) {
      console.error('❌ Failed to save language to preferences:', error);
      return false;
    }
  }

  /**
   * Get language statistics
   */
  getLanguageStats() {
    return {
      currentLanguage: this.currentLanguage,
      supportedLanguages: Object.keys(this.supportedLanguages).length,
      translationsAvailable: Object.keys(this.translations).length,
      currentTranslations: Object.keys(
        this.translations[this.currentLanguage] || {}
      ).length,
    };
  }
}

module.exports = MultiLanguageManager;
