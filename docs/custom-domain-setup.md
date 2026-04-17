# Custom Domain Setup: korobkovart.com

## Статус (2026-04-17)

| Крок | Статус | Деталі |
|------|--------|--------|
| Cloudflare zone створено | DONE | Zone ID: `cd7a55817e817c64c45c5d0dc27cb02b` |
| DNS CNAME apex | DONE | `korobkovart.com` → tunnel (proxied) |
| DNS CNAME www | DONE | `www.korobkovart.com` → tunnel (proxied) |
| SSL Full + Always HTTPS + TLS 1.3 | DONE | Налаштовано через API |
| Tunnel ingress rules | DONE | `korobkovart.com` + `www.korobkovart.com` → port 8060 |
| Code: metadataBase + canonical | DONE | `layout.tsx`, `next.config.ts` |
| Code: www redirect middleware | DONE | `middleware.ts` |
| NS зміна на реєстраторі | ПОТРІБНО ВРУЧНУ | Кроки нижче |

## Єдина ручна дія: зміна Nameservers на реєстраторі

**Cloudflare nameservers для korobkovart.com:**
```
marissa.ns.cloudflare.com
yew.ns.cloudflare.com
```

### Кроки (залежать від реєстратора):

1. Увійти в панель реєстратора де зареєстровано `korobkovart.com`
   (наприклад: Namecheap, GoDaddy, Google Domains, Porkbun, etc.)

2. Знайти розділ **Nameservers** або **DNS Settings**

3. Замінити поточні NS на:
   - `marissa.ns.cloudflare.com`
   - `yew.ns.cloudflare.com`

4. Зберегти. Поширення DNS займає до 24 годин (зазвичай 30-60 хвилин).

5. Перевірити статус у Cloudflare Dashboard:
   - Зайти на https://dash.cloudflare.com
   - Вибрати `korobkovart.com`
   - Статус має змінитись з "Pending" на "Active"

## Після активації zone

Сайт буде доступний автоматично:
- `https://korobkovart.com` → основний сайт
- `https://www.korobkovart.com` → redirect 301 на apex

## Технічні деталі

- **Cloudflare Zone ID:** `cd7a55817e817c64c45c5d0dc27cb02b`
- **Cloudflare Account ID:** `b008cce6f5a6caf9ad043c466c2a8c24`
- **Tunnel ID:** `06515d43-f34e-4d1b-b897-fa5995bc5474`
- **Container:** `korobkov` на Mini (port 8060 → 3000)
- **SSL:** Full (Cloudflare encrypts to origin через tunnel)
- **Certificate:** автоматичний Universal SSL від Cloudflare (безкоштовний)

## Google OAuth (після активації)

Потрібно додати `https://korobkovart.com` до Authorized redirect URIs в Google Cloud Console:
- URL: https://console.cloud.google.com/apis/credentials
- Client ID: `169888667160-ufgr6grfa650vruqn7cpvdvgq9vrv3sr.apps.googleusercontent.com`
- Додати: `https://korobkovart.com/api/auth/callback/google`

## Перевірка після NS propagation

```bash
# Перевірити DNS
dig korobkovart.com NS +short

# Перевірити що сайт відкривається
curl -sI https://korobkovart.com | head -5

# Перевірити www redirect
curl -sI https://www.korobkovart.com | grep -E "HTTP|Location"
```
