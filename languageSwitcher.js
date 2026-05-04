/**
 * Language Switcher for WK Transport
 * Loads translations from translations.json and applies them to elements with data-i18n attributes
 */
(function () {
  let translations = null;
  const STORAGE_KEY = 'wk_language';
  const DEFAULT_LANG = 'en';
  const SUPPORTED_LANGS = ['en', 'nl', 'es'];

  // Get saved language or default
  function getSavedLanguage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED_LANGS.includes(saved) ? saved : DEFAULT_LANG;
  }

  // Fetch translations (uses XMLHttpRequest for file:// protocol compatibility)
  function loadTranslations() {
    return new Promise(function (resolve) {
      if (translations) { resolve(translations); return; }
      try {
        var xhr = new XMLHttpRequest();
        xhr.overrideMimeType('application/json');
        xhr.open('GET', 'translations.json', true);
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200 || xhr.status === 0) { // status 0 for file://
              try {
                translations = JSON.parse(xhr.responseText);
                resolve(translations);
              } catch (e) {
                console.error('Failed to parse translations:', e);
                resolve(null);
              }
            } else {
              console.error('Failed to load translations, status:', xhr.status);
              resolve(null);
            }
          }
        };
        xhr.send();
      } catch (err) {
        console.error('Failed to load translations:', err);
        resolve(null);
      }
    });
  }

  // Apply translations to the page
  function applyTranslations(lang) {
    if (!translations || !translations[lang]) return;

    const t = translations[lang];

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      // Support dot-separated keys like "career.hero_title_1" → look up "career_hero" or just the key
      // Try direct key first, then try converting dot notation
      let value = t[key];
      if (!value) {
        // Try converting "career.hero_title_1" → "career_hero_title_1"
        const flatKey = key.replace('.', '_');
        value = t[flatKey];
      }
      if (value) {
        el.textContent = value;
      }
    });

    // Update active state of language buttons
    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
      const btnLang = btn.getAttribute('data-lang-btn');
      if (btnLang === lang) {
        btn.classList.add('lang-active');
        btn.classList.remove('text-gray-500');
      } else {
        btn.classList.remove('lang-active');
        btn.classList.add('text-gray-500');
      }
    });

    // Update the globe button text to show current language
    document.querySelectorAll('.lang-current').forEach(el => {
      el.textContent = lang.toUpperCase();
    });

    // Update html lang attribute
    document.documentElement.setAttribute('lang', lang);
  }

  // Switch language
  window.switchLanguage = async function (lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return;
    localStorage.setItem(STORAGE_KEY, lang);

    if (!translations) {
      await loadTranslations();
    }
    applyTranslations(lang);

    // Close all open language dropdowns
    document.querySelectorAll('.lang-dropdown-menu').forEach(menu => {
      menu.classList.add('hidden');
    });
  };

  // Toggle dropdown
  window.toggleLangDropdown = function (e) {
    e.stopPropagation();
    const btn = e.currentTarget;
    const menu = btn.nextElementSibling;
    if (!menu) return;

    // Close all other dropdowns first
    document.querySelectorAll('.lang-dropdown-menu').forEach(m => {
      if (m !== menu) m.classList.add('hidden');
    });

    menu.classList.toggle('hidden');
  };

  // Close dropdowns on outside click
  document.addEventListener('click', () => {
    document.querySelectorAll('.lang-dropdown-menu').forEach(menu => {
      menu.classList.add('hidden');
    });
  });

  // Initialize on page load
  async function init() {
    await loadTranslations();
    const lang = getSavedLanguage();
    if (lang !== DEFAULT_LANG) {
      applyTranslations(lang);
    }
    // Always update button states
    applyTranslations(lang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
