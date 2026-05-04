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
        xhr.overrideMimeType('application/json; charset=UTF-8');
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

    function setTranslatedText(el, value) {
      const textNodes = Array.from(el.childNodes).filter(node => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim());
      if (el.children.length && textNodes.length) {
        const leading = textNodes[0].nodeValue.match(/^\s*/)[0];
        const trailing = textNodes[0].nodeValue.match(/\s*$/)[0];
        textNodes[0].nodeValue = leading + value + trailing;
        textNodes.slice(1).forEach(node => { node.nodeValue = ''; });
      } else {
        el.textContent = value;
      }
    }

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
        setTranslatedText(el, value);
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const value = t[el.getAttribute('data-i18n-placeholder')];
      if (value) el.setAttribute('placeholder', value);
    });

    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
      const value = t[el.getAttribute('data-i18n-alt')];
      if (value) el.setAttribute('alt', value);
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const value = t[el.getAttribute('data-i18n-title')];
      if (value) el.setAttribute('title', value);
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
      const value = t[el.getAttribute('data-i18n-aria-label')];
      if (value) el.setAttribute('aria-label', value);
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
    updateActiveNavigation();
  }

  function getCurrentPageName() {
    const path = window.location.pathname.split('/').pop().toLowerCase();
    return path || 'index.html';
  }

  function getLinkPageName(link) {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:')) return '';
    return href.split('#')[0].split('?')[0].split('/').pop().toLowerCase();
  }

  function setNavText(el, active) {
    const key = el.getAttribute('data-i18n');
    const lang = getSavedLanguage();
    const t = translations && translations[lang] ? translations[lang] : null;
    if (!key || !t || !t[key]) return;

    const text = t[key].replace(/^\[\s*/, '').replace(/\s*\]$/, '').trim();
    const value = active ? `[ ${text} ]` : text;
    const textNodes = Array.from(el.childNodes).filter(node => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim());
    if (el.children.length && textNodes.length) {
      const leading = textNodes[0].nodeValue.match(/^\s*/)[0];
      const trailing = textNodes[0].nodeValue.match(/\s*$/)[0];
      textNodes[0].nodeValue = leading + value + trailing;
      textNodes.slice(1).forEach(node => { node.nodeValue = ''; });
    } else {
      el.textContent = value;
    }
  }

  function updateActiveNavigation() {
    const current = getCurrentPageName();
    document.querySelectorAll('header nav a[data-i18n], header a[href$="getaquote.html"][data-i18n="nav_quote"], #mobileMenu a[data-i18n]').forEach(link => {
      const linkPage = getLinkPageName(link);
      const active = linkPage === current || (current === 'index.html' && linkPage === 'index.html');
      const isDesktopNav = Boolean(link.closest('nav'));

      link.classList.toggle('text-[#E8511A]', active);
      if (isDesktopNav) {
        link.classList.toggle('before:w-full', active);
        link.classList.toggle('before:w-0', !active);
      }

      setNavText(link, active);
    });
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
