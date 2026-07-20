
# Landing "Trading Assistant" — Dg-Developers

Página única de venta con checkout Stripe. Adaptamos tu spec de Next.js App Router al stack real del proyecto (TanStack Start + Vite + Tailwind v4). Diseño editorial sobrio con acento **tinta azul** (`#1E3A5F`), fondo hueso, y tipografía Fraunces + Inter + JetBrains Mono vía Google Fonts.

## Rutas (equivalente a App Router)

```text
src/routes/
  __root.tsx                       # head global, <link> a Google Fonts, wordmark
  index.tsx                        # landing completa (10 secciones)
  success.tsx                      # confirmación post-pago
  cancel.tsx                       # pago cancelado
  api/
    checkout.ts                    # POST -> crea Checkout Session, devuelve { url }
    public/
      stripe-webhook.ts            # POST público, verifica firma, maneja checkout.session.completed
```

`api/public/*` es el prefijo que Lovable expone sin gate de auth: es donde debe vivir el webhook de Stripe.

## Flujo de compra

1. Cliente hace `POST /api/checkout` (fetch desde el botón "Comprar").
2. Server route usa `stripe` (SDK oficial) con `STRIPE_SECRET_KEY` para crear una Checkout Session:
   - `mode: 'payment'`
   - `line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }]`
   - `success_url: ${origin}/success?session_id={CHECKOUT_SESSION_ID}`
   - `cancel_url: ${origin}/cancel`
3. Devuelve `{ url }`; el cliente hace `window.location.href = url` (no hace falta `@stripe/stripe-js` si sólo redirigimos; lo instalo igualmente por si quieres extender a Elements/Payment Element más adelante — dime si prefieres omitirlo para ahorrar peso).
4. `/success` lee `session_id` de la query, llama a un `createServerFn` `getCheckoutSession` que hace `stripe.checkout.sessions.retrieve` y muestra estado real (pagado / pendiente) + copy de "te llegará por correo".
5. `/cancel` mensaje amable + botón "Volver".
6. Webhook `/api/public/stripe-webhook`:
   - `runtime: nodejs` no aplica (corremos en Cloudflare Workers con nodejs_compat).
   - Leemos raw body con `await request.text()` y verificamos con **`stripe.webhooks.constructEventAsync`** (la versión sync usa `crypto` de Node de una forma incompatible con Workers).
   - En `checkout.session.completed`: `TODO: emitir licencia + enviar correo con enlace de descarga`.
   - Responde 200 rápido; errores de firma → 400.

## Secretos

Los pediré por el formulario seguro de Lovable (no `.env.example` — Lovable no usa `.env` en runtime):

- `STRIPE_SECRET_KEY` (server)
- `STRIPE_WEBHOOK_SECRET` (server)
- `STRIPE_PRICE_ID` (server; el price ID del producto en Stripe)
- `VITE_STRIPE_PUBLISHABLE_KEY` (cliente, opcional — sólo si añadimos Stripe.js en el futuro)

`NEXT_PUBLIC_SITE_URL` no se usa: derivo el origin de la request en el server route (funciona en preview, producción y custom domain sin config).

## Diseño

**Paleta** (semantic tokens en `src/styles.css`, oklch):
- `--background`: hueso cálido `oklch(0.972 0.012 85)` (`#F5F1E8` aprox)
- `--foreground`: tinta casi-negra `oklch(0.18 0.01 250)` (`#141414` aprox)
- `--accent-ink`: tinta azul `oklch(0.32 0.06 250)` (`#1E3A5F`) — CTAs y reglas de énfasis
- `--muted-foreground`: gris cálido `#8A8578`
- `--rule`: 1px `oklch(0.85 0.01 85)` para divisorias
- Dark mode coherente opcional (invierte hueso→carbón, mantiene el acento tinta azul).

**Tipografía** (Google Fonts vía `<link>` en `__root.tsx`):
- `Fraunces` (serif alto contraste, opsz variable) → H1/H2 grandes con `font-optical-sizing` alto y `wdth` ligeramente condensado en titulares.
- `Inter` → cuerpo.
- `JetBrains Mono` → labels tabulares (precio, especificaciones, numeración de secciones "01 / 02 / 03…").
- Tokens: `--font-serif`, `--font-sans`, `--font-mono` en `@theme`.

**Layout**:
- Grid de 12 columnas con márgenes generosos, alineaciones asimétricas.
- Reglas horizontales 1px entre secciones, no cards con sombra.
- Etiquetas en mayúsculas con `tracking-[0.18em]` mono para "SECCIÓN 03 · SEGURIDAD".
- Tabla real (`<table>`) en especificaciones, tipografía mono para columna de valores.
- Microinteracciones: hover en CTA (subrayado que crece, no lift), transiciones `150ms ease-out`, scroll-reveal sutil con IntersectionObserver (fade + 8px translate).

## Secciones (una sola ruta `/`)

```text
┌─ Header sticky ─ wordmark izq · Comprar (aparece condensado tras hero)
├─ 01 Hero ─ titular serif + subtítulo + CTA + microdato · mockup chat HTML/CSS
├─ 02 Prompts ─ "Solo escribe cosas como…" 4 tarjetas tipográficas
├─ 03 Qué incluye ─ 6 features en grid asimétrico 2/3+1/3
├─ 04 Seguro por diseño ─ 3 puntos con reglas verticales
├─ 05 Listo en 4 pasos ─ pasos numerados mono, línea vertical
├─ 06 Especificaciones ─ tabla técnica
├─ 07 FAQ ─ 4 preguntas, acordeón <details> nativo estilizado
├─ 08 CTA cierre ─ promesa + botón grande "Comprar ahora"
└─ Footer ─ Dg-Developers · año · links legales placeholder
```

**Mockup del hero** (HTML/CSS, sin imágenes): ventana con barra de título, burbuja usuario "¿a cuánto está el Bitcoin?", respuesta del asistente con card de precio (símbolo BTC, precio en mono, variación 24h en verde/rojo, timestamp). Todo con divs, sin SVG externo.

## Componentes

```text
src/components/
  layout/
    StickyHeader.tsx        # 'use client' — detecta scroll, muestra CTA condensado
    Footer.tsx
  sections/
    Hero.tsx
    ChatMockup.tsx          # el mockup del hero, puro CSS
    PromptExamples.tsx
    Features.tsx
    Security.tsx
    Steps.tsx
    Specs.tsx
    Faq.tsx
    ClosingCta.tsx
  ui/
    BuyButton.tsx           # 'use client' — fetch /api/checkout, loading, error, redirect
    SectionHeading.tsx      # "01 · SECCIÓN" + título serif
    Rule.tsx                # divisoria 1px
```

Server Components por defecto (que en TanStack Start = SSR normal). `'use client'` sólo en `StickyHeader` (scroll listener) y `BuyButton` (fetch/estado).

## Manejo de errores en BuyButton

- Estado `idle | loading | error`.
- Deshabilita durante `loading`, muestra "Redirigiendo a Stripe…".
- En error: banner inline discreto con `role="alert"`, botón "Reintentar". Nada de toasts.

## Accesibilidad

- Contraste AA verificado (tinta azul sobre hueso ≥ 7:1).
- Focus visible con outline 2px tinta azul + offset.
- `<details>` nativo para FAQ (accesible por teclado sin JS extra).
- `prefers-reduced-motion` desactiva scroll-reveal.
- `alt` en decorativos = "".

## Notas técnicas relevantes del stack

- Backend corre en **Cloudflare Workers (nodejs_compat)**, no Node.js completo. Por eso: `constructEventAsync` en webhook, sin `child_process`, sin `fs.watch`. El SDK `stripe@latest` funciona bien aquí (usa `fetch`).
- **Copy 100% en español**, datos reales del producto (no lorem).
- **README.md** en la raíz con: cómo pegar las claves en Lovable Secrets, cómo crear producto/price en Stripe Dashboard, cómo probar el webhook local (`stripe listen --forward-to`), URL estable del webhook en producción (`project--{id}.lovable.app/api/public/stripe-webhook`), y notas de despliegue.
- **TODOs marcados** en el handler del webhook para la emisión de licencia y envío de correo.

## Orden de ejecución al pasar a build

1. `bun add stripe @stripe/stripe-js` (el segundo es opcional; confirmo si lo omito).
2. Pedir secretos (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID`) por formulario seguro.
3. Actualizar `styles.css` con tokens + fuentes; `__root.tsx` con `<link>` Fonts + meta reales.
4. Crear componentes y secciones.
5. Reescribir `src/routes/index.tsx` (eliminar placeholder).
6. Crear `success.tsx`, `cancel.tsx`, `api/checkout.ts`, `api/public/stripe-webhook.ts`.
7. Server function `getCheckoutSession` para la página de éxito.
8. README.
