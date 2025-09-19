/**
 * Voice Input/Output Manager
 * Handles voice commands, speech recognition, and text-to-speech
 */

class VoiceManager {
  constructor() {
    this.isSupported = this.checkSupport();
    this.isListening = false;
    this.isSpeaking = false;
    this.recognition = null;
    this.synthesis = null;
    this.currentLanguage = 'en-US';
    this.voiceSettings = {
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      voice: null,
    };
    this.commands = new Map();
    this.callbacks = {
      onResult: null,
      onError: null,
      onStart: null,
      onEnd: null,
      onSpeechStart: null,
      onSpeechEnd: null,
    };
  }

  /**
   * Check if voice features are supported
   */
  checkSupport() {
    if (typeof window === 'undefined') {
      return false; // Server-side
    }

    const speechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const speechSynthesis = window.speechSynthesis;

    return !!(speechRecognition && speechSynthesis);
  }

  /**
   * Initialize voice features
   */
  async initialize() {
    if (!this.isSupported) {
      throw new Error('Voice features not supported in this environment');
    }

    try {
      // Initialize Speech Recognition
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();

      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = this.currentLanguage;
      this.recognition.maxAlternatives = 1;

      // Set up recognition event handlers
      this.recognition.onstart = () => {
        this.isListening = true;
        console.log('🎤 Voice recognition started');
        if (this.callbacks.onStart) this.callbacks.onStart();
      };

      this.recognition.onresult = event => {
        const results = Array.from(event.results);
        const transcript = results
          .map(result => result[0].transcript)
          .join('')
          .trim();

        if (event.results[event.results.length - 1].isFinal) {
          console.log('🎤 Voice recognition result:', transcript);
          if (this.callbacks.onResult) this.callbacks.onResult(transcript);
        }
      };

      this.recognition.onerror = event => {
        console.error('❌ Voice recognition error:', event.error);
        this.isListening = false;
        if (this.callbacks.onError) this.callbacks.onError(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        console.log('🎤 Voice recognition ended');
        if (this.callbacks.onEnd) this.callbacks.onEnd();
      };

      // Initialize Speech Synthesis
      this.synthesis = window.speechSynthesis;

      console.log('🎤 Voice features initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize voice features:', error);
      throw error;
    }
  }

  /**
   * Start listening for voice commands
   */
  startListening() {
    if (!this.recognition) {
      throw new Error('Voice recognition not initialized');
    }

    if (this.isListening) {
      console.log('🎤 Already listening');
      return;
    }

    try {
      this.recognition.start();
    } catch (error) {
      console.error('❌ Failed to start listening:', error);
      throw error;
    }
  }

  /**
   * Stop listening
   */
  stopListening() {
    if (!this.recognition || !this.isListening) {
      return;
    }

    try {
      this.recognition.stop();
    } catch (error) {
      console.error('❌ Failed to stop listening:', error);
    }
  }

  /**
   * Speak text
   */
  async speak(text, options = {}) {
    if (!this.synthesis) {
      throw new Error('Speech synthesis not initialized');
    }

    if (this.isSpeaking) {
      this.stopSpeaking();
    }

    return new Promise((resolve, reject) => {
      try {
        const utterance = new SpeechSynthesisUtterance(text);

        // Apply voice settings
        utterance.rate = options.rate || this.voiceSettings.rate;
        utterance.pitch = options.pitch || this.voiceSettings.pitch;
        utterance.volume = options.volume || this.voiceSettings.volume;
        utterance.lang = options.lang || this.currentLanguage;

        if (options.voice || this.voiceSettings.voice) {
          utterance.voice = options.voice || this.voiceSettings.voice;
        }

        utterance.onstart = () => {
          this.isSpeaking = true;
          console.log('🔊 Speech started:', text.substring(0, 50) + '...');
          if (this.callbacks.onSpeechStart) this.callbacks.onSpeechStart();
        };

        utterance.onend = () => {
          this.isSpeaking = false;
          console.log('🔊 Speech ended');
          if (this.callbacks.onSpeechEnd) this.callbacks.onSpeechEnd();
          resolve();
        };

        utterance.onerror = event => {
          this.isSpeaking = false;
          console.error('❌ Speech error:', event.error);
          reject(event.error);
        };

        this.synthesis.speak(utterance);
      } catch (error) {
        console.error('❌ Failed to speak:', error);
        reject(error);
      }
    });
  }

  /**
   * Stop speaking
   */
  stopSpeaking() {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.cancel();
      this.isSpeaking = false;
      console.log('🔊 Speech stopped');
    }
  }

  /**
   * Set voice settings
   */
  setVoiceSettings(settings) {
    this.voiceSettings = { ...this.voiceSettings, ...settings };
    console.log('🎤 Voice settings updated:', this.voiceSettings);
  }

  /**
   * Get available voices
   */
  getAvailableVoices() {
    if (!this.synthesis) {
      return [];
    }

    return this.synthesis.getVoices().map(voice => ({
      name: voice.name,
      lang: voice.lang,
      gender: voice.gender || 'unknown',
      localService: voice.localService,
      default: voice.default,
    }));
  }

  /**
   * Set voice
   */
  setVoice(voiceName) {
    const voices = this.synthesis.getVoices();
    const voice = voices.find(v => v.name === voiceName);

    if (voice) {
      this.voiceSettings.voice = voice;
      console.log('🎤 Voice set to:', voice.name);
      return true;
    }

    console.warn('⚠️ Voice not found:', voiceName);
    return false;
  }

  /**
   * Set language
   */
  setLanguage(language) {
    this.currentLanguage = language;
    if (this.recognition) {
      this.recognition.lang = language;
    }
    console.log('🌍 Voice language set to:', language);
  }

  /**
   * Register voice command
   */
  registerCommand(phrase, callback, options = {}) {
    const command = {
      phrase: phrase.toLowerCase(),
      callback,
      options: {
        exact: false,
        caseSensitive: false,
        ...options,
      },
    };

    this.commands.set(phrase.toLowerCase(), command);
    console.log('🎤 Voice command registered:', phrase);
  }

  /**
   * Unregister voice command
   */
  unregisterCommand(phrase) {
    const removed = this.commands.delete(phrase.toLowerCase());
    if (removed) {
      console.log('🎤 Voice command unregistered:', phrase);
    }
    return removed;
  }

  /**
   * Process voice command
   */
  processVoiceCommand(transcript) {
    const lowerTranscript = transcript.toLowerCase();

    for (const [phrase, command] of this.commands) {
      let matches = false;

      if (command.options.exact) {
        matches = command.options.caseSensitive
          ? transcript === phrase
          : lowerTranscript === phrase;
      } else {
        matches = lowerTranscript.includes(phrase);
      }

      if (matches) {
        console.log('🎤 Voice command matched:', phrase);
        try {
          command.callback(transcript, command.options);
        } catch (error) {
          console.error('❌ Voice command error:', error);
        }
        return true;
      }
    }

    return false;
  }

  /**
   * Set callbacks
   */
  setCallbacks(callbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  /**
   * Get voice status
   */
  getStatus() {
    return {
      supported: this.isSupported,
      listening: this.isListening,
      speaking: this.isSpeaking,
      language: this.currentLanguage,
      voiceSettings: this.voiceSettings,
      commandsCount: this.commands.size,
      availableVoices: this.getAvailableVoices().length,
    };
  }

  /**
   * Enable voice commands for AIOS
   */
  enableAIOSCommands() {
    // Basic navigation commands
    this.registerCommand('go to login', () => {
      if (typeof window !== 'undefined' && window.location) {
        window.location.href = '/login';
      }
    });

    this.registerCommand('go to apps', () => {
      if (typeof window !== 'undefined' && window.location) {
        window.location.href = '/apps';
      }
    });

    this.registerCommand('go to dashboard', () => {
      if (typeof window !== 'undefined' && window.location) {
        window.location.href = '/dashboard';
      }
    });

    // AI interaction commands
    this.registerCommand('ask AI', transcript => {
      const question = transcript.replace(/ask AI/i, '').trim();
      if (question) {
        // Trigger AI query
        console.log('🤖 AI Query:', question);
        // This would integrate with the AIOS Smart Agent
      }
    });

    this.registerCommand('help', () => {
      this.speak(
        'I can help you navigate the AIOS system. Try saying "go to login", "go to apps", or "ask AI" followed by your question.'
      );
    });

    // System commands
    this.registerCommand('stop listening', () => {
      this.stopListening();
      this.speak('Stopped listening');
    });

    this.registerCommand('start listening', () => {
      this.startListening();
      this.speak('Started listening');
    });

    console.log('🎤 AIOS voice commands enabled');
  }

  /**
   * Process voice input for AIOS Smart Agent
   */
  async processAIOSVoiceInput(transcript, smartAgent) {
    try {
      // Check for voice commands first
      if (this.processVoiceCommand(transcript)) {
        return;
      }

      // Process as AI query
      if (smartAgent) {
        const response = await smartAgent.processQuery(transcript);

        // Speak the response
        if (response.text) {
          await this.speak(response.text);
        }
      }
    } catch (error) {
      console.error('❌ Failed to process voice input:', error);
      await this.speak(
        'Sorry, I encountered an error processing your request.'
      );
    }
  }

  /**
   * Get voice analytics
   */
  getVoiceAnalytics() {
    return {
      totalCommands: this.commands.size,
      isActive: this.isListening || this.isSpeaking,
      language: this.currentLanguage,
      voiceSettings: this.voiceSettings,
      supportStatus: this.isSupported,
    };
  }
}

module.exports = VoiceManager;
