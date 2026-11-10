/**
 * Storage Module - Secure local state management
 * [SECURITY]: Strict whitelisting for stored language values to prevent storage poisoning.
 */
const Storage = (function () {
  'use strict';

  const ALLOWED_LANGS = Object.freeze(['en', 'ar']);
  const DEFAULT_LANG = 'en';

  const keys = Object.freeze({
    lang: 'zizo_lang',
    introSeen: 'zizo_intro_seen',
  });

  return {
    keys,

    /**
     * Get stored language with whitelist validation
     * [SECURITY]: Returns only validated 'en' or 'ar' values
     */
    getLang() {
      try {
        const stored = localStorage.getItem(keys.lang);
        if (stored && ALLOWED_LANGS.includes(stored)) {
          return stored;
        }
        return DEFAULT_LANG;
      } catch (e) {
        return DEFAULT_LANG;
      }
    },

    /**
     * Store language preference with validation
     * [SECURITY]: Rejects any value not in ALLOWED_LANGS
     */
    setLang(lang) {
      if (!ALLOWED_LANGS.includes(lang)) {
        console.warn('[Security] Ignored attempt to set invalid language:', lang);
        return;
      }
      try {
        localStorage.setItem(keys.lang, lang);
      } catch (e) {
        // Handle Private Browsing / Storage Quota errors gracefully
      }
    },

    /**
     * Check if intro screen has been viewed
     */
    hasSeenIntro() {
      try {
        return localStorage.getItem(keys.introSeen) === '1';
      } catch (e) {
        return false;
      }
    },

    /**
     * Mark intro screen as viewed
     */
    markIntroSeen() {
      try {
        localStorage.setItem(keys.introSeen, '1');
      } catch (e) {}
    },

    /**
     * Reset intro view state
     */
    resetIntro() {
      try {
        localStorage.removeItem(keys.introSeen);
      } catch (e) {}
    }
  };
})();

