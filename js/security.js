/**
 * Security Utilities Module (ZIZO Portfolio)
 * Provides centralized XSS protection, Output Encoding, URL Sanitization, and Input Defense.
 */

const SecurityUtils = (function () {
  'use strict';

  // Allowed safe URL schemes
  const SAFE_URL_PATTERN = /^(?:(?:https?|mailto):|\/|\.\/|\.\.\/|assets\/|data\/)/i;
  // Disallowed dangerous protocols & formats
  const DANGEROUS_PROTOCOLS = /^(?:javascript|data|vbscript|file):/i;

  /**
   * HTML Entity Encoding to prevent Cross-Site Scripting (XSS)
   * Converts &, <, >, ", ', `, and / to their safe HTML entities.
   * @param {*} str - Input to encode
   * @returns {string} - HTML-safe string
   */
  function escapeHTML(str) {
    if (str == null) return '';
    return String(str).replace(/[&<>"'`\/]/g, function (char) {
      switch (char) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#39;';
        case '/': return '&#x2F;';
        case '`': return '&#x60;';
        default: return char;
      }
    });
  }

  /**
   * Attribute Value Encoding
   * Escapes characters that could break out of HTML attributes.
   * @param {*} str - Attribute string
   * @returns {string} - Attribute-safe string
   */
  function escapeAttr(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/`/g, '&#x60;');
  }

  /**
   * Sanitize URLs to prevent XSS via `javascript:` or `data:` payloads
   * @param {string} url - Target URL
   * @param {string} fallback - Fallback URL if invalid (default: '#')
   * @returns {string} - Validated safe URL
   */
  function sanitizeUrl(url, fallback = '#') {
    if (!url || typeof url !== 'string') return fallback;
    const trimmed = url.trim();

    // Block dangerous pseudo-protocols
    if (DANGEROUS_PROTOCOLS.test(trimmed)) {
      console.warn('[Security] Blocked dangerous URL protocol:', trimmed);
      return fallback;
    }

    // Must match safe protocol or relative path
    if (SAFE_URL_PATTERN.test(trimmed) || /^[a-zA-Z0-9_\-\.\/]+$/.test(trimmed)) {
      return trimmed;
    }

    console.warn('[Security] URL rejected by safety whitelist:', trimmed);
    return fallback;
  }

  /**
   * Sanitize user input (removes unprintable control characters, trims, limits length)
   * @param {string} input - Raw user input
   * @param {number} maxLength - Maximum allowable length (default: 5000)
   * @returns {string} - Sanitized plain text
   */
  function sanitizeInput(input, maxLength = 5000) {
    if (typeof input !== 'string') return '';
    // Strip null bytes and non-printable control characters except newline and tab
    const cleaned = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    return cleaned.trim().slice(0, maxLength);
  }

  /**
   * Safe text node creator / textContent setter
   * @param {HTMLElement} element - Target element
   * @param {string} text - Text to set safely
   */
  function setText(element, text) {
    if (element && 'textContent' in element) {
      element.textContent = text == null ? '' : String(text);
    }
  }

  /**
   * Strict validation for email addresses
   * @param {string} email - Email address
   * @returns {boolean}
   */
  function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const emailRe = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return email.length <= 254 && emailRe.test(email.trim());
  }

  /**
   * Prevent Clickjacking / UI Redressing via frame-busting if embedded maliciously
   */
  function enforceFrameProtection() {
    try {
      if (window.top !== window.self) {
        window.top.location = window.self.location;
      }
    } catch (e) {
      // In case of cross-origin frame restriction, CSP frame-ancestors handles it
    }
  }

  // Freeze object to prevent runtime tampering / Prototype pollution
  return Object.freeze({
    escapeHTML,
    escapeAttr,
    sanitizeUrl,
    sanitizeInput,
    setText,
    isValidEmail,
    enforceFrameProtection
  });
})();

// Export globally for browser scripts
if (typeof window !== 'undefined') {
  window.SecurityUtils = SecurityUtils;
  // Run frame protection on load
  SecurityUtils.enforceFrameProtection();
}
