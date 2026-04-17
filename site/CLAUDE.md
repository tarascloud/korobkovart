# Korobkov Art Studio (ko)

## URLs ta kontejnery
- **URL:** https://ko.taras.cloud
- **Kontejner:** `korobkov` (:8060->3000)
- **BD:** `pg:5432/korobkov` (user: korobkov)
- **GitHub:** `tarascloud/korobkovart` (private)

## Stek
- Next.js 16, React 19, TypeScript, Prisma 7 (@prisma/adapter-pg)
- Tailwind CSS 4, next-intl 4 (en/es/ua), Framer Motion
- NextAuth 5 (Google OAuth), owner: tpedchenko@gmail.com
- Docker: Node 22-alpine, standalone output

## Struktura
- `src/app/[locale]/` -- publichni storinky (home, gallery, about, exhibitions, partners, contact)
- `src/app/[locale]/admin/` -- admin panel (owner only): artworks CRUD, collections, orders
- `src/app/[locale]/account/` -- buyer account: profile, addresses, order history
- `src/app/api/admin/` -- admin API routes (role check OWNER)
- `src/app/api/account/` -- buyer API routes (auth check)
- `src/app/api/auth/` -- NextAuth handlers
- `src/components/` -- React components (client)
- `src/components/admin/` -- admin components
- `src/components/account/` -- buyer account components
- `src/lib/` -- auth, prisma, shipping calculator, translate-medium, artworks queries
- `src/data/` -- legacy static artworks (replaced by DB, kept as backup)
- `src/messages/` -- i18n (en.json, es.json, ua.json)
- `prisma/schema.prisma` -- DB schema
- `public/artworks/` -- artwork images

## BD modeli
User, Account, Session (auth), Artwork, Collection, ArtworkCollection, Address, Order

## Deploj
```bash
ssh mini 'cd /opt/repos/taras-code/korobkovart/site && git pull origin main && docker build --build-arg DATABASE_URL="postgresql://korobkov:korobkov@pg:5432/korobkov" -t korobkov:latest . && cd /opt/docker && docker compose up -d --force-recreate korobkov'
```

## Lokalna rozrobka
Potriben SSH tunnel do Mini dlja dostupu do PostgreSQL:
```bash
ssh -fN -L 5432:localhost:5432 mini
cd korobkovart/site && npm run dev
```
