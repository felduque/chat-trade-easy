# Trading Assistant — Dg-Developers

Landing de un solo producto ("Trading Assistant", un servidor MCP para
Claude Desktop / Cursor) con checkout de Stripe. Construida sobre
**TanStack Start + Vite + Tailwind CSS v4**, desplegable en Cloudflare
Workers vía Lovable Cloud.

## Stack

- TanStack Start (App Router-equivalente basado en `src/routes/`).
- TypeScript estricto.
- Tailwind v4 (design system en `src/styles.css`, tokens `oklch`).
- Stripe Node SDK (`stripe`) para server-side; redirect a Stripe Checkout
  (no Elements — cero claves secretas en el bundle cliente).
- Fuentes Fraunces + Inter + JetBrains Mono vía Google Fonts.

## Estructura

```
src/
  routes/
    __root.tsx                 # meta, fuentes, layout
    index.tsx                  # landing completa (10 secciones)
    success.tsx                # confirmación post-pago
    cancel.tsx                 # pago cancelado
    api/
      checkout.ts              # POST /api/checkout -> { url }
      public/
        stripe-webhook.ts      # POST /api/public/stripe-webhook
  components/
    StickyHeader.tsx           # header sticky con CTA condensado
    BuyButton.tsx              # botón que crea la Checkout Session y redirige
    ChatMockup.tsx             # mockup del hero (puro CSS)
    Reveal.tsx                 # scroll-reveal sutil
  lib/
    stripe.server.ts           # factory del cliente Stripe (server-only)
    checkout.functions.ts      # server function que lee la sesión post-pago
```

## Configurar Stripe

### 1. Crear el producto y precio en Stripe Dashboard

1. Entra a [Stripe Dashboard → Productos](https://dashboard.stripe.com/products).
2. **Añadir producto**:
   - Nombre: `Trading Assistant`
   - Descripción: la que quieras que vea el cliente.
   - **Precio**: `Precio único` (one-time), pon el monto en USD.
3. Guarda y copia el **Price ID** (`price_...`) — no el Product ID.

### 2. Obtener las claves

- **API key secreta**: Dashboard → Desarrolladores → API keys → `Secret key`
  (`sk_test_...` en modo test, `sk_live_...` en producción).
- **Webhook signing secret**: se genera al crear el endpoint (paso 4).

### 3. Guardarlas en Lovable

Este proyecto NO usa `.env` en runtime. Los secretos se guardan en el sistema
de secrets de Lovable y se inyectan como variables de entorno en el server:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_ID`

Ya se piden desde el agente Lovable con el formulario seguro — no los pongas
en el código ni en ningún archivo commit.

### 4. Configurar el webhook

En Dashboard → Desarrolladores → Webhooks → **Add endpoint**:

- **URL de producción**:
  `https://project--<PROJECT_ID>.lovable.app/api/public/stripe-webhook`
- **URL de preview** (opcional):
  `https://project--<PROJECT_ID>-dev.lovable.app/api/public/stripe-webhook`
- **Eventos**: `checkout.session.completed` (mínimo). Opcional:
  `checkout.session.expired`.
- Al crearlo, Stripe muestra el **signing secret** (`whsec_...`). Guárdalo como
  `STRIPE_WEBHOOK_SECRET`.

> El prefijo `/api/public/*` es lo que Lovable expone sin gate de auth para
> callers externos. La seguridad del endpoint la aporta la verificación HMAC
> de la firma que hace `stripe.webhooks.constructEventAsync`.

### 5. Probar el webhook en local

Con el CLI de Stripe:

```bash
stripe login
stripe listen --forward-to http://localhost:8080/api/public/stripe-webhook
```

El CLI te dará un `whsec_...` temporal. Usa ese mientras desarrollas,
guardándolo también en `STRIPE_WEBHOOK_SECRET` en tus secretos de preview.

Para disparar un evento manualmente:

```bash
stripe trigger checkout.session.completed
```

## Flujo de compra

1. Usuario hace click en **Comprar** → `POST /api/checkout`.
2. El server route crea una `Checkout Session` (`mode: payment`, un solo line
   item con `STRIPE_PRICE_ID`) y devuelve `{ url }`.
3. El botón hace `window.location.href = url` → Stripe Checkout.
4. Éxito → `/success?session_id=…` verifica la sesión con
   `stripe.checkout.sessions.retrieve` y muestra el resumen.
5. Cancelación → `/cancel`.
6. En paralelo, Stripe llama al webhook `/api/public/stripe-webhook`:
   - Verifica la firma con `constructEventAsync` (SubtleCrypto — compatible
     con Cloudflare Workers).
   - En `checkout.session.completed`: **TODO** — emitir licencia y enviar
     correo con el enlace de descarga (buscar los `TODO:` en el archivo).

## Desarrollo

El sandbox de Lovable ya corre el dev server. Localmente:

```bash
bun install
bun run dev
```

Abre `http://localhost:8080`.

## Deploy

Se publica con el botón **Publish** de Lovable. El backend se despliega en
Cloudflare Workers (con `nodejs_compat`); el SDK de Stripe usa `fetch`
en runtime — no requiere configuración extra.

URLs estables (no cambian aunque renombres el proyecto):

- Producción: `https://project--<PROJECT_ID>.lovable.app`
- Preview: `https://project--<PROJECT_ID>-dev.lovable.app`

Configura el webhook de Stripe contra esas URLs para que no se rompa cuando
haya cambios de dominio.

## TODOs abiertos (post-pago)

En `src/routes/api/public/stripe-webhook.ts`, dentro del handler de
`checkout.session.completed`:

- Generar y persistir una licencia por sesión / cliente.
- Enviar correo transaccional (Resend, Postmark…) con la licencia y el link
  de descarga del binario.

Todo lo demás — landing, checkout, verificación de firma, páginas de
success / cancel — está funcional.
