// Общий скрипт главной и 404.html. Выбирает язык; на 404.html разбирает адрес: /@логин —
// ссылка на профиль (карточка с кнопкой, открывающей приложение), иначе «страницы нет».
(() => {
  const root = document.documentElement;

  // Язык: русский — для русского, белорусского, украинского и казахского браузера, иначе
  // английский. Кнопка в шапке переключает и запоминает выбор.
  const titles = { ru: document.title, en: document.title };
  if (!document.getElementById('profile')) {
    titles.ru = 'MKey — мессенджер без номера телефона';
    titles.en = 'MKey — a messenger without phone numbers';
  }
  const setLang = (l) => {
    root.dataset.l = l;
    root.lang = l;
    document.getElementById('lang').textContent = l === 'ru' ? 'EN' : 'RU';
    document.title = titles[l];
  };
  let saved = null;
  try {
    saved = localStorage.getItem('lang');
  } catch (_) {
    // Хранилище закрыто (приватное окно) — язык берётся из браузера.
  }
  setLang(saved === 'ru' || saved === 'en' ? saved : /^(ru|be|uk|kk)\b/i.test(navigator.language || '') ? 'ru' : 'en');
  document.getElementById('lang').addEventListener('click', () => {
    const l = root.dataset.l === 'ru' ? 'en' : 'ru';
    setLang(l);
    try {
      localStorage.setItem('lang', l);
    } catch (_) {
      // Не запомнится — не страшно.
    }
  });

  const profile = document.getElementById('profile');
  if (!profile) return; // главная

  // Ссылка на профиль: только целый логин (3–32 знака: латиница, цифры, подчёркивание) —
  // те же правила, что в приложении.
  const m = /^\/@([A-Za-z0-9_]{3,32})\/?$/.exec(location.pathname);
  if (!m) {
    document.getElementById('notfound').hidden = false;
    return;
  }
  const login = '@' + m[1];
  document.getElementById('login').textContent = login;
  document.getElementById('open').href = 'mkey://user/' + login;
  profile.hidden = false;
  titles.ru = titles.en = login + ' — MKey';
  document.title = titles.ru;
})();
