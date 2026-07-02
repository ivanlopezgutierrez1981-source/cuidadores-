# cuidadores.xyz

Marketplace que conecta **familias** con **cuidadores y cuidadoras** de niños,
personas mayores y personas dependientes.

- 🆓 Registro gratuito para cuidadores
- ⭐ Planes de **destacado** (primera fila) vía Stripe: 7 días (9 €) o mensual (19,99 €)
- 🔎 Las familias buscan y contactan **gratis**, sin registro
- 🛡️ Panel de administración protegido
- 🇪🇸 Páginas legales RGPD + banner de cookies

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS**
- **Supabase** — Auth + PostgreSQL + Storage (fotos)
- **Stripe** — Checkout + Webhooks para los planes de destacado
- Despliegue en **Vercel**

---

## 1. Requisitos

- Node.js 18.17+ (recomendado 20+)
- Una cuenta de [Supabase](https://supabase.com)
- Una cuenta de [Stripe](https://stripe.com)

## 2. Instalación local

```bash
git clone <tu-repo> cuidadores-xyz
cd cuidadores-xyz
npm install
cp .env.example .env.local   # y rellena tus claves
npm run dev
```

Abre http://localhost:3000

## 3. Configurar Supabase

1. Crea un proyecto nuevo en Supabase.
2. Ve a **SQL Editor → New query**, pega el contenido de
   [`supabase/schema.sql`](supabase/schema.sql) y ejecútalo.
   Esto crea las tablas (`profiles`, `subscriptions`, `contacts`), las
   políticas RLS, el bucket de Storage `fotos` y los triggers.
3. En **Project Settings → API** copia:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ solo servidor)
4. En **Authentication → Providers** habilita **Email**.

## 4. Configurar Stripe

Los planes de destacado son **pagos únicos** (no suscripción recurrente):

- **7 días** → 9,00 € · **Mensual (30 días)** → 19,99 €

Los precios se definen en un único sitio: `src/lib/types.ts` → `PLANES`
(usando `price_data`, así que **no necesitas crear productos/precios en Stripe**).

### Pasos

1. En **Developers → API keys** copia la clave secreta y la publicable a
   `STRIPE_SECRET_KEY` y `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
2. Crea el endpoint de webhook (ver abajo) y copia su secreto a
   `STRIPE_WEBHOOK_SECRET`.

### Probar el webhook en local

Con la [CLI de Stripe](https://stripe.com/docs/stripe-cli):

```bash
# 1) en una terminal, arranca la app
npm run dev

# 2) en otra terminal, reenvía los eventos a tu webhook local
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

El comando imprime un `whsec_...`: cópialo a `STRIPE_WEBHOOK_SECRET` en
`.env.local` y reinicia `npm run dev`.

Para simular un pago: ve a `/destacar` (con sesión iniciada), elige un plan y
paga con la tarjeta de prueba `4242 4242 4242 4242`, cualquier fecha futura y
cualquier CVC. El webhook marcará tu perfil como destacado.

> El flujo: `/destacar` → `POST /api/checkout` (crea la sesión y redirige a
> Stripe) → pago → `checkout.session.completed` → `POST /api/webhooks/stripe`
> (calcula `destacado_hasta` y actualiza `profiles` + `subscriptions`).

## 5. Panel admin

Añade tu email a `ADMIN_EMAILS` (separa varios por comas). Las rutas bajo
`/admin` comprobarán que el usuario autenticado está en esa lista.

---

## Variables de entorno

Ver [`.env.example`](.env.example) para la lista completa con comentarios.

| Variable | Descripción |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima (cliente) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave service_role (solo servidor) |
| `STRIPE_SECRET_KEY` | Clave secreta de Stripe |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clave publicable de Stripe |
| `STRIPE_WEBHOOK_SECRET` | Secreto de firma del webhook (`whsec_…`) |
| `ADMIN_EMAILS` | Emails con acceso a `/admin` |

---

## Despliegue en Vercel

1. Sube el repositorio a GitHub/GitLab.
2. En [Vercel](https://vercel.com) → **New Project** → importa el repo.
3. En **Settings → Environment Variables** añade todas las variables de
   `.env.example` con tus valores de producción.
4. Pon `NEXT_PUBLIC_SITE_URL` a tu dominio (`https://cuidadores.xyz`).
5. **Deploy**.
6. En Stripe, crea un endpoint de webhook apuntando a
   `https://cuidadores.xyz/api/webhooks/stripe` y copia su `whsec_...` a la
   variable de entorno en Vercel.

---

## Estructura del proyecto

```
src/
  app/
    layout.tsx          # Layout raíz (header, footer, cookies)
    page.tsx            # Página de inicio
    globals.css         # Estilos + utilidades Tailwind
  components/
    Header.tsx
    Footer.tsx
    SearchBar.tsx       # Buscador de la home
    CookieBanner.tsx
  lib/
    types.ts            # Tipos del dominio + planes
    supabase/
      client.ts         # Cliente navegador
      server.ts         # Cliente servidor + admin (service_role)
supabase/
  schema.sql            # Esquema completo de la base de datos
```

## Hoja de ruta (siguientes fases)

- [ ] Auth: registro / login de cuidadores (Supabase Auth)
- [ ] Crear y editar perfil + subida de foto a Storage
- [ ] Página `/buscar` con filtros y ordenación (destacados primero)
- [ ] Ficha de cuidador `/cuidador/[id]` + formulario de contacto
- [ ] Stripe Checkout + webhook (`/api/webhooks/stripe`) para destacar
- [ ] Panel `/admin` (moderación de perfiles y pagos)
- [ ] Páginas legales (`/legal/*`)
```
