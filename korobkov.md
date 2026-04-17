# Korobkov Art Studio — Новий сайт

## Мета проекту
Створити преміальний сайт-галерею для **Korobkov Art Studio** (Михайло Коробков та Ольга Коробкова) з функцією продажу оригінальних картин, пошуку партнерів (галереї, колекціонери, куратори) та максимального просування в інтернеті.

**URL:** ko.taras.cloud
**Старий сайт:** korobkovart.com (React SPA, завантажено в `korobkov-old/`)

---

## Про художників (контекст з буклету)

### Михайло Коробков
- Народився 1985, Крим, Україна. Живе та працює в Києві
- Монументаліст. Полотна, розпис стін, інсталяції
- **Освіта:** Кримське художнє училище ім. Самокиша (живопис), Харківська академія дизайну і мистецтв (монументальний живопис)
- **Виставки спільні:** BSMT Art Gallery London (2022), Charity Auction Krakow (05.2022), Helicon Art Center Izmit Turkey (2021), Інститут проблем сучасного мистецтва Києва (2019), Експоцентр України (07.2018), Art-zavod Platforma Kyiv (2018)
- **Персональні:** Gallery Circulo de la Amistad Cordoba Spain (06.2023), Gallery OKiS Wroclaw Poland (08.2022), Хмельницький обласний художній музей (2022), Представництво НАТО в Україні Київ (2019), Lviv Modern Art Museum (2013)
- **Контакт:** +38 (063) 475 56 19, korobkov.art, korobkovart.com

### Серії робіт
1. **"Podilia"** — орнаменти подільських килимів + людська фігура. Оголене жіноче тіло з графічними елементами. Історія переплітається з сучасністю. Олія + акрил + аерозоль. Контекст: Російсько-Українська війна, Поділля
2. **"Destruction" (Руйнація)** — відбитки війни. Ракети, зламані долі, сльози горя. Оптимізм попри все. Колажі, текстиль, інсталяції
3. **Murals** — монументальні розписи (до 800x1200 см)

### Каталог робіт (з буклету, ~50+ робіт)
- Peace in our hands (2023, mural, 800x1200 cm)
- Podilia+Ermilov (2023, canvas, acrylic/oil/spray, 160x120 cm)
- Concrete flowers (2023, canvas, oil/acrylic, 100x85 cm)
- Podolyanka5 (2023, canvas, 170x150 cm)
- Collage (2023, oil on canvas, 100x105 cm)
- Childhood (2023, canvas, oil/acrylic, 100x125 cm)
- Podilia (2023, mural, 400x1000 cm)
- Deep dreaming (2023, canvas, 180x150 cm)
- Podolyanka (2023, oil on canvas, 120x100 cm)
- Podolyanka1 (2023, canvas, 80x75 cm)
- Black flowers (2023, oil on canvas, 120x95 cm)
- Podolyanka2 (2023, canvas, 80x75 cm)
- Podolyanka3 (2023, canvas, 80x70 cm)
- Podolyanka4 (2023, two canvases, 80x70 cm)
- Cabaret in Podilia (2023, canvas, 80x70 cm)
- Family (2023, canvas, 80x65 cm)
- Sympatia (2023, canvas, 115x90 cm)
- Sasha (2023, canvas, 80x65 cm)
- Lucretia (2022, canvas, 80x65 cm)
- Bulvarno-Kudriavska Street 34 (2022, canvas, 80x65 cm)
- Destruction/Activation (2022, canvas+textile+collage, 200x350 cm) — with Liza Obukhovska
- Destruction/Activation (2022, plywood+canvas+textile, 180x80 cm) — with Liza Obukhovska
- Destruction (2022, canvas, acrylic/spray, 120x80 cm)
- Memento mori (2022, canvas, 95x85 cm)
- Destruction silkscreen (silkscreen, 5 layers, limited ed. 50, 70x50 cm)
- Reflection silkscreen (silkscreen, 2 layers, limited ed. 50, 70x50 cm)
- Destruction 4 (2022, canvas, 95x85 cm)
- Destruction 2 (2022, canvas, 100x90 cm)
- Destruction 3 (2022, canvas, 100x90 cm)
- Stop (2022, canvas, 110x90 cm)
- Print (2022, canvas, collage/oil, 139x123 cm)
- Destruction sculpture (2022, mixed media, 120x80 cm)
- Go where it's scary (2022, canvas/oil, 200x160 cm)
- Skin (2022, canvas, 120x100 cm)
- Children of nature (2022, canvas/collage, 130x115 cm)
- Collage (2022, canvas/oil, 160x120 cm)
- + ~20 ранніх робіт зі старого сайту (муралі 1-9, графіка тощо)

---

## Дизайн-концепція

### Стиль (на основі буклету + логотипу)
- **Мінімалізм галерейного простору** — білі/сірі фони як стіни галереї
- **Логотип [K]** — геометричний символ у квадратних дужках, анімований (draw-on ефект при завантаженні)
- **Шрифт:** Gilroy (вже використовується в буклеті) + системний sans-serif fallback
- **Кольори light theme:** фон #F5F5F0 (теплий білий як стіна галереї), текст #1A1A1A, акцент #000000, secondary #666666
- **Кольори dark theme:** фон #0A0A0A, текст #F0F0F0, акцент #FFFFFF, secondary #888888
- **Layout буклету:** header з [K] ліворуч + горизонтальна лінія + рік праворуч — цей патерн використати як навігаційний елемент
- **Фото робіт:** великі, з мʼякою тінню, як в буклеті (картина на стіні галереї)
- **Hover:** легке масштабування (scale 1.02), caption зʼявляється знизу
- **Переходи сторінок:** fade + subtle slide

### Анімація логотипу [K]
SVG анімація при завантаженні сайту:
1. Малюються квадратні дужки [ ] (stroke-dashoffset)
2. Всередині зʼявляється K-символ (draw-on по контуру)
3. Текст "KOROBKOV ART STUDIO" fade-in праворуч
4. Тривалість ~2.5с, один раз при першому візиті (sessionStorage)

---

## Структура сайту (сторінки)

### 1. Home (/)
- Hero: fullscreen анімація логотипу → переходить у вибрані роботи (3-4 шт.) з parallax scroll
- Short statement: "Ukrainian contemporary art studio. Paintings, murals, installations."
- Featured works carousel (6-8 штук)
- CTA: "View Gallery" / "Inquire About Works"
- Секція "Available Now" — 3-4 роботи з кнопкою inquiry

### 2. Gallery (/gallery)
- Фільтри по серіях: All / Podilia / Destruction / Murals / Graphics / Earlier Works
- Grid layout (masonry) з адаптивними колонками
- Кожна картина — thumbnail → клік → full-page artwork view
- Lazy loading, blur placeholder (LQIP)

### 3. Artwork Detail (/gallery/[slug])
- Fullscreen фото роботи
- Metadata: назва, рік, техніка, розмір, серія
- Статус: Available / Sold / On Exhibition
- Кнопка "Inquire" → відкриває форму запиту (імʼя, email, повідомлення)
- Related works (з тієї ж серії)
- Lightbox для zoom

### 4. About (/about)
- Фото художників (з буклету — обоє в студії)
- Біографія Михайла (education, exhibitions)
- Artist statement (серія Podilia, серія Destruction)
- Timeline виставок
- Завантажити PDF буклет

### 5. Exhibitions (/exhibitions)
- Список виставок (спільні + персональні)
- Кожна з фото, датою, локацією
- Upcoming / Past розділи

### 6. Partners (/partners)
- Для галерей, кураторів, колекціонерів
- "Why Partner With Us" — statement
- Collaboration types: Gallery Exhibition, Mural Commission, Curatorial Project, Corporate Art
- Форма запиту партнерства (тип, галерея/імʼя, країна, повідомлення)
- Press kit download (PDF буклет + hi-res images)

### 7. Contact (/contact)
- Форма: імʼя, email, тема (Buy Artwork / Commission / Exhibition / Other), повідомлення
- Контакти: телефон, email, Instagram, соцмережі
- Location: Kyiv, Ukraine

---

## Технічний стек

### Frontend
- **Next.js 16** (App Router, SSG для швидкості)
- **React 19**, TypeScript 6
- **Tailwind CSS 4** + custom design tokens
- **next-intl** — 3 мови: en, es, ua
- **next-themes** — light/dark toggle
- **Framer Motion** — анімації, page transitions, логотип
- **sharp** — image optimization

### Content & Data
- **JSON** для artwork catalog (не потрібна БД на старті)
- Кожна робота = запис з metadata + зображення в public/artworks/
- Форми: API route → Telegram notification (через VS bot)

### Infrastructure
- **Docker:** Node 22-alpine, multi-stage build
- **URL:** ko.taras.cloud (Cloudflare Tunnel через Mini)
- **Контейнер:** `korobkov` на Mini (:8050→3000)
- **docker-compose:** додати в `vs-private/infra/docker-compose.yml`

### SEO & Performance
- SSG (Static Site Generation) — всі сторінки pre-rendered
- Structured Data (JSON-LD): ArtGallery, VisualArtwork, Person
- Open Graph + Twitter Cards з hero images
- Sitemap.xml, robots.txt
- Core Web Vitals: LCP < 2.5s, CLS < 0.1
- Image optimization: WebP/AVIF, responsive srcset, blur placeholders

---

## Мови (i18n)

| Ключ | EN | ES | UA |
|------|----|----|------|
| site.title | Korobkov Art Studio | Korobkov Art Studio | Коробков Арт Студія |
| nav.gallery | Gallery | Galería | Галерея |
| nav.about | About | Sobre nosotros | Про нас |
| nav.exhibitions | Exhibitions | Exposiciones | Виставки |
| nav.partners | Partners | Socios | Партнери |
| nav.contact | Contact | Contacto | Контакти |
| hero.tagline | Contemporary Ukrainian Art | Arte Contemporáneo Ucraniano | Сучасне Українське Мистецтво |

Default: EN (міжнародна аудиторія, покупці, галереї)

---

## Digital Marketing & Просування

### Phase 1: Foundational (при запуску)
1. **SEO on-page:** meta tags, structured data, alt texts для всіх картин
2. **Google Search Console + Analytics 4** — підключити
3. **Social meta:** OG images для кожної роботи (auto-generated)
4. **Sitemap submission** до Google, Bing

### Phase 2: Content & Social
5. **Instagram** — link in bio → ko.taras.cloud, щотижневі пости
6. **Google Business Profile** — якщо є фізична студія
7. **Pinterest** — створити бізнес-акаунт, pinати кожну роботу з посиланням
8. **Artsy / Saatchi Art / Artfinder** — профіль з посиланням на сайт

### Phase 3: Paid & Outreach
9. **Google Ads:** "buy contemporary ukrainian art", "mural artist for hire", "art from ukraine"
10. **Meta Ads (Instagram/Facebook):** carousel з роботами → landing page
11. **Email outreach:** галереї Іспанії/UK/Польщі (де вже виставлялись)
12. **Art fairs calendar:** заявки на участь

### Phase 4: PR & Content Marketing
13. **Blog/News section** — виставки, process videos, artist statements
14. **Press releases** — при нових виставках
15. **YouTube/Reels** — painting process, studio tour
16. **Art publications** — submissions до онлайн журналів

---

## Декомпозиція задач

### Wave 1: Foundation (MVP)
| # | Задача | Тип | Залежності |
|---|--------|-----|-----------|
| 1.1 | Init Next.js project в `korobkovart/site/` | developer | — |
| 1.2 | Design tokens + Tailwind config (colors, fonts, spacing) | developer | — |
| 1.3 | SVG логотип [K] + анімація (Framer Motion) | developer | 1.1 |
| 1.4 | Layout: Header + Footer + Navigation (burger mobile) | developer | 1.2 |
| 1.5 | i18n setup (next-intl): en, es, ua | developer | 1.1 |
| 1.6 | Dark/Light theme toggle (next-themes) | developer | 1.2 |
| 1.7 | Artwork data model (JSON) + seed з буклету | developer | — |
| 1.8 | Оптимізувати зображення з старого сайту (WebP, responsive) | developer | 1.7 |

### Wave 2: Pages
| # | Задача | Тип | Залежності |
|---|--------|-----|-----------|
| 2.1 | Home page: hero + featured works + CTA | developer | 1.3, 1.4, 1.7 |
| 2.2 | Gallery page: grid + фільтри по серіях | developer | 1.7, 1.8 |
| 2.3 | Artwork detail page: fullscreen + metadata + inquiry | developer | 2.2 |
| 2.4 | About page: біографія + artist statement | developer | 1.4 |
| 2.5 | Exhibitions page: timeline | developer | 1.4 |
| 2.6 | Partners page: info + форма | developer | 1.4 |
| 2.7 | Contact page: форма + контакти | developer | 1.4 |

### Wave 3: Polish & Deploy
| # | Задача | Тип | Залежності |
|---|--------|-----|-----------|
| 3.1 | Page transitions + scroll animations | developer | Wave 2 |
| 3.2 | SEO: structured data, OG images, sitemap | developer | Wave 2 |
| 3.3 | Dockerfile + docker-compose entry | devsecops | Wave 2 |
| 3.4 | Cloudflare tunnel: ko.taras.cloud → :8050 | devsecops | 3.3 |
| 3.5 | SSL + headers (CSP, HSTS) | devsecops | 3.4 |
| 3.6 | Performance audit (Lighthouse 95+) | tester | 3.4 |
| 3.7 | Cross-browser testing | tester | 3.4 |

### Wave 4: Marketing
| # | Задача | Тип | Залежності |
|---|--------|-----|-----------|
| 4.1 | Google Analytics 4 + Search Console | devsecops | 3.4 |
| 4.2 | Social media profiles setup | smm | 3.4 |
| 4.3 | Art platform listings (Saatchi, Artsy) | smm | 3.4 |
| 4.4 | Google Ads campaign setup | smm | 4.1 |
| 4.5 | Gallery outreach email templates | smm | 3.4 |

---

## Файлова структура проекту

```
korobkovart/
├── korobkov.md                    # цей документ
├── docs/
│   ├── 1 Korobkov-logo K kas.png  # логотип
│   └── Коробков_кінець2друк.pdf   # буклет
├── korobkovart.com/               # старий сайт (reference)
└── site/                          # НОВИЙ САЙТ
    ├── package.json
    ├── next.config.ts
    ├── tailwind.config.ts
    ├── Dockerfile
    ├── public/
    │   ├── artworks/              # оптимізовані зображення робіт
    │   ├── logo.svg               # SVG логотип
    │   ├── favicon.ico
    │   ├── robots.txt
    │   └── sitemap.xml
    ├── src/
    │   ├── app/
    │   │   ├── [locale]/
    │   │   │   ├── layout.tsx
    │   │   │   ├── page.tsx           # Home
    │   │   │   ├── gallery/
    │   │   │   │   ├── page.tsx       # Gallery grid
    │   │   │   │   └── [slug]/
    │   │   │   │       └── page.tsx   # Artwork detail
    │   │   │   ├── about/page.tsx
    │   │   │   ├── exhibitions/page.tsx
    │   │   │   ├── partners/page.tsx
    │   │   │   └── contact/page.tsx
    │   │   └── api/
    │   │       └── inquiry/route.ts   # Contact form handler
    │   ├── components/
    │   │   ├── Logo.tsx               # Animated [K] logo
    │   │   ├── Header.tsx
    │   │   ├── Footer.tsx
    │   │   ├── ThemeToggle.tsx
    │   │   ├── LanguageSwitcher.tsx
    │   │   ├── ArtworkCard.tsx
    │   │   ├── ArtworkGrid.tsx
    │   │   ├── InquiryForm.tsx
    │   │   ├── ExhibitionTimeline.tsx
    │   │   └── HeroSection.tsx
    │   ├── data/
    │   │   ├── artworks.ts            # Artwork catalog
    │   │   └── exhibitions.ts         # Exhibition list
    │   ├── lib/
    │   │   └── types.ts
    │   └── messages/
    │       ├── en.json
    │       ├── es.json
    │       └── ua.json
    └── .env.example
```

---

## Пріоритет запуску

**MVP (Wave 1+2):** робочий сайт з усіма сторінками, 3 мовами, dark/light theme
**Production (Wave 3):** deploy на ko.taras.cloud, SEO, performance
**Marketing (Wave 4):** просування, реклама, outreach

Перший крок: `Wave 1.1` — init Next.js project.
