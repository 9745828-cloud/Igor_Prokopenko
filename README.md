# Игорь Прокопенко — официальный сайт

Одностраничный премиальный сайт-визитка: Tailwind CSS (собран локально) + vanilla JS +
Three.js (раздел «Медиа ДНК»). Без бэкенда — все данные редактируются в JS-файлах,
формы работают через `fetch` на внешний сервис по вашему выбору.

## Структура проекта

```
index.html                     — вся разметка страницы (шапка, hero, 8 разделов, футер)
assets/css/
  tailwind-input.css           — исходник для сборки Tailwind (@tailwind директивы)
  tailwind.css                 — СОБРАННЫЙ файл, подключён в index.html (не редактировать руками)
  style.css                    — кастомные стили: шрифты, grain-текстура, анимации, 3D-обвязка
assets/js/
  content-data.js               — ВСЕ тексты и данные разделов (единая точка редактирования)
  main.js                       — рендер данных, навигация, табы, аккордеон, формы, модалка
  dna-scene.js                  — 3D-сцена раздела «Медиа ДНК» (Three.js)
  vendor/three/                 — self-hosted Three.js + OrbitControls (без внешнего CDN)
tailwind.config.js              — палитра и шрифты Tailwind
package.json                    — скрипты сборки CSS
vercel.json / .vercelignore     — конфигурация деплоя на Vercel
```

## Деплой на Vercel

Сайт полностью статический и уже готов к деплою — CSS собран и закоммичен,
Three.js self-hosted, внешних build-шагов не требуется.

**Через дашборд Vercel:**
1. [vercel.com/new](https://vercel.com/new) → Import Git Repository → выбрать этот репозиторий.
2. Framework Preset — оставить **Other**.
3. Остальное подхватится из `vercel.json` автоматически (Install/Build команды — no-op,
   Output Directory — корень репозитория).
4. Deploy.

**Через Vercel CLI:**
```bash
npm i -g vercel
vercel        # preview-деплой
vercel --prod # деплой в продакшн
```

После подключения кастомного домена обновите в `index.html`:
- `<link rel="canonical" href="...">`
- `og:url`, `og:image`, `twitter:image` — на реальный домен и обложку.

## Запуск локально

Сайт полностью статичный — просто откройте `index.html` через любой локальный сервер
(двойной клик по файлу тоже сработает, но ES-модуль `dna-scene.js` требует http(s)-протокол,
поэтому лучше так):

```bash
npm run serve
# либо: python3 -m http.server 8080
```

## Сборка Tailwind

CSS уже собран и закоммичен (`assets/css/tailwind.css`). Пересобирайте его после
любого изменения классов в `index.html` или `assets/js/*.js`:

```bash
npm install
npm run build:css     # разовая сборка (минифицированная)
npm run watch:css      # пересборка при каждом изменении во время разработки
```

## Как обновить «Тайну дня»

Файл `assets/js/content-data.js`, массив `mysteryOfTheDay`. Карточка «Сегодня»
выбирается автоматически по номеру дня в году (`день_года % длина_массива`) —
без бэкенда и без ручного планирования дат. Чтобы добавить новую тайну —
просто добавьте объект в конец массива:

```js
{
  year: "2022",
  tag: "Наука",                 // используется как фильтр в архиве
  quote: "Цитата или фрагмент программы.",
  correlation: "Почему это перекликается с сегодняшним днём."
}
```

**Важно:** цитаты в поставке — иллюстративные примеры. Перед публикацией замените
их на точные цитаты и тайм-коды из архива программ.

## Как добавить вопрос в «Спроси Прокопенко»

Файл `assets/js/content-data.js`, массив `qna`. Добавьте объект:

```js
{ q: "Текст вопроса?", a: "Текст ответа." }
```

Раздел рендерится как аккордеон автоматически — порядок в массиве = порядок на странице.

## Подключение форм (раздел «Спроси Прокопенко» и «Контакты»)

Сейчас обе формы (`#ask-form`, `#contact-form`) при отправке только показывают
блок-«спасибо» (`main.js`, функция `setupForm`) — реальная отправка не настроена.

Чтобы подключить приём заявок, в `assets/js/main.js` внутри `setupForm` замените
комментарий `// TODO` на реальный запрос, например через
[Formspree](https://formspree.io) / [Getform](https://getform.io) / свой API:

```js
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!form.checkValidity()) { form.reportValidity(); return; }

  await fetch(form.dataset.endpoint, {
    method: "POST",
    body: new FormData(form),
    headers: { Accept: "application/json" }
  });

  form.classList.add("hidden");
  success?.classList.remove("hidden");
  form.reset();
});
```

Адрес приёма укажите в атрибуте `data-endpoint` на самой форме в `index.html`
(сейчас там заглушка `#`).

## Обновление остальных разделов

Всё содержимое сайта (хроника жизни, узлы «Медиа ДНК», принципы метода, пресса,
соцсети) вынесено в объект `window.SITE_DATA` в `assets/js/content-data.js` —
разметка (`index.html`) и логика (`main.js`, `dna-scene.js`) ничего не знают
о конкретных текстах и просто рендерят массивы. Добавление или правка пункта —
это правка одного объекта в соответствующем массиве, без изменений в HTML.

## Фото и медиа

Портрет в hero-блоке и другие фотографии — стилизованные плейсхолдеры
(`.portrait-frame` в `style.css`). Замените их на реальные изображения:

1. Положите файлы в `assets/img/` (например `hero-portrait.jpg`).
2. В `index.html` замените блок `.portrait-frame` на `<img>` с этим путём и `alt`-текстом.
3. Обновите `og:image` в `<head>` на реальную обложку для соцсетей.

## SEO

- Мета-теги, Open Graph, Twitter Card и JSON-LD (`schema.org/Person`) — в `<head>` `index.html`.
- Заполните `sameAs` в JSON-LD реальными ссылками на профили после того, как добавите их в `assets/js/content-data.js` (`social`).
- Замените `og:image` на реальное изображение перед публикацией (текущий путь — заглушка).
