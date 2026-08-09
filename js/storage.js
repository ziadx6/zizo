const Storage = {
  keys: {
    lang: 'zizo_lang',
    introSeen: 'zizo_intro_seen',
  },
  getLang() {
    try { return localStorage.getItem(this.keys.lang) || 'en'; }
    catch { return 'en'; }
  },
  setLang(lang) {
    try { localStorage.setItem(this.keys.lang, lang); } catch {}
  },
  hasSeenIntro() {
    try { return localStorage.getItem(this.keys.introSeen) === '1'; }
    catch { return false; }
  },
  markIntroSeen() {
    try { localStorage.setItem(this.keys.introSeen, '1'); } catch {}
  },
  resetIntro() {
    try { localStorage.removeItem(this.keys.introSeen); } catch {}
  }
};
