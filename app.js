// Общий скрипт главной и 404.html. Выбирает язык; на 404.html разбирает адрес: /c#<токен> —
// одноразовая ссылка на контакт (приложение открывается само, кнопка — запасной путь), иначе
// «страницы нет». По сети страница никуда не ходит: чья это ссылка и жива ли она, знает только
// приложение, поэтому показ страницы (и предпросмотр ссылки в чужом мессенджере) её не тратит.
(() => {
  const root = document.documentElement;

  // Язык: русский — для русского, белорусского, украинского и казахского браузера, иначе
  // английский. Кнопка в шапке переключает и запоминает выбор.
  const titles = { ru: document.title, en: document.title };
  if (!document.getElementById('contact')) {
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

  const contact = document.getElementById('contact');
  if (!contact) return; // главная

  // Ссылка на контакт: только целый токен — ровно 43 знака base64url (32 байта без
  // дополнения), та же проверка формы, что в приложении. Имени и логина в адресе нет, и
  // странице их взять неоткуда. Любой другой адрес — «страницы нет».
  // Токен стоит после «#»: эту часть адреса браузер не отправляет ни хостингу страницы, ни
  // тому, кто строит предпросмотр ссылки в чужом мессенджере, — погасить ссылку раньше
  // адресата им нечем.
  const m = /^\/c\/?$/.test(location.pathname) && /^#([A-Za-z0-9_-]{43})$/.exec(location.hash);
  if (!m) {
    document.getElementById('notfound').hidden = false;
    return;
  }
  const link = 'mkey://contact/' + m[1];
  document.getElementById('open').href = link;
  contact.hidden = false;
  // Сразу пробуем открыть приложение, как это делает страница t.me: браузер либо спросит
  // «Открыть MKey?», либо молча ничего не сделает, если приложения нет, — тогда остаётся
  // кнопка. Неизвестную схему часть браузеров отвергает исключением.
  setTimeout(() => {
    try {
      location.href = link;
    } catch (_) {
      // Приложения нет или браузер не пускает без нажатия — человек нажмёт кнопку сам.
    }
  }, 150);
  titles.ru = 'Приглашение в MKey';
  titles.en = 'Invitation to MKey';
  document.title = titles[root.dataset.l];
})();
