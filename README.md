# Trading Assistant — Landing + Checkout con Creem

Landing de venta de un único producto (un servidor MCP para clientes de IA como
Claude Desktop / Cursor) con checkout de **Creem**. Construida sobre:

- TanStack Start v1 (App Router equivalente basado en Vite + React 19)
- TypeScript estricto
- Tailwind CSS v4 (tokens semánticos en `src/styles.css`)
- Creem (merchant of record — cubre países donde Stripe no opera)

> Nota: este proyecto **no** usa Next.js aunque el brief original lo mencionara.
> El stack base de Lovable es TanStack Start; los conceptos son equivalentes:
> file-based routing en `src/routes/`, server routes para APIs, y server
> functions tipadas para RPC cliente→servidor.

## Estructura

    src/
      routes/
        __root.tsx                       # shell + <head>
        index.tsx                        # landing (8 secciones)
        success.tsx                      # /success — verifica firma del redirect
        cancel.tsx                       # /cancel
        api/
          checkout.ts                    # POST /api/checkout  → crea checkout en Creem
          public/
            creem-webhook.ts             # POST /api/public/creem-webhook
      components/
        StickyHeader.tsx
        BuyButton.tsx
        ChatMockup.tsx
        Reveal.tsx
      lib/
        pricing.ts                       # precio, precio promo y fecha de fin
        creem.server.ts                  # cliente Creem + verificación HMAC
        checkout.functions.ts            # verifyCreemRedirect (server fn)

## Configurar Creem

### 1. Crear el producto en Creem

1. Entra al [dashboard de Creem](https://dashboard.creem.io).
2. Crea un producto **Trading Assistant** de pago único.
3. Crea **dos precios / productos**:
   - Precio completo: **20 USD** → guarda su `product_id` como `CREEM_PRODUCT_ID`.
   - Precio promo lanzamiento: **10 USD** → guarda su `product_id` como
     `CREEM_PRODUCT_ID_PROMO`.

La landing decide cuál usar según la fecha (`src/lib/pricing.ts`):

- Hasta el **31 de julio de 2026 (23:59 UTC)** → precio promo.
- Después → precio completo (y el badge de descuento desaparece automáticamente).

Si sólo configuras `CREEM_PRODUCT_ID`, se usa siempre ese; el descuento
seguirá reflejado en el copy pero el cobro será el del `CREEM_PRODUCT_ID`.

### 2. Sacar la API key

En Creem → Developers → API Keys. Copia la clave (`creem_test_...` para
pruebas, `creem_live_...` para producción) y guárdala como `CREEM_API_KEY`.

### 3. Configurar el webhook

En Creem → Developers → Webhooks, crea un endpoint apuntando a la URL estable
del proyecto en Lovable:

- Preview: `https://project--<PROJECT_ID>-dev.lovable.app/api/public/creem-webhook`
- Producción: `https://project--<PROJECT_ID>.lovable.app/api/public/creem-webhook`

Activa al menos los eventos:

- `checkout.completed` / `order.paid`
- `refund.created` / `order.refunded`

Al crearlo Creem muestra un **signing secret**. Guárdalo como
`CREEM_WEBHOOK_SECRET`.

## Variables de entorno

Todas se configuran vía Lovable (add_secret). Nunca en un `.env` versionado.

| Nombre                    | Uso                                                    |
| ------------------------- | ------------------------------------------------------ |
| `CREEM_API_KEY`           | Clave secreta de Creem (creem_test_… / creem_live_…)   |
| `CREEM_PRODUCT_ID`        | Producto de precio completo (20 USD)                   |
| `CREEM_PRODUCT_ID_PROMO`  | (Opcional) Producto de precio promo (10 USD)           |
| `CREEM_WEBHOOK_SECRET`    | Secreto de firma HMAC del webhook                      |
| `CREEM_API_BASE`          | (Opcional) Override de `https://api.creem.io`          |

## Flujo end-to-end

1. Usuario hace click en un **Comprar** → `BuyButton` hace `POST /api/checkout`.
2. `/api/checkout` elige `product_id` (promo o completo según la fecha) y llama
   a `POST https://api.creem.io/v1/checkouts` con `x-api-key`.
3. Redirige al `checkout_url` de Creem.
4. Tras pagar, Creem redirige a `/success?checkout_id=...&order_id=...&signature=...`.
5. `/success` verifica la firma con `verifyCreemRedirect` (HMAC-SHA256 con la
   API key sobre los parámetros ordenados alfabéticamente y unidos con `|`).
6. En paralelo, Creem llama al webhook `/api/public/creem-webhook` con el
   header `creem-signature`. Verificamos HMAC-SHA256 del body en crudo contra
   `CREEM_WEBHOOK_SECRET`. Ahí procesamos `checkout.completed`.

## TODOs pendientes (marcados en el código)

En `src/routes/api/public/creem-webhook.ts`, dentro del case
`checkout.completed`:

- Emitir la licencia (generar `license_key`, guardarla asociada al `order_id`).
- Enviar el correo con la licencia y el enlace de descarga (Resend / Postmark).

## Notas técnicas

- El SDK oficial de Creem no es necesario: usamos `fetch` directo, compatible
  con Cloudflare Workers.
- La verificación HMAC usa `SubtleCrypto` (no `crypto` de Node) para funcionar
  en el runtime de Cloudflare Workers.
- Todo el copy de la landing está en español.
- `src/lib/pricing.ts` es la fuente única del precio y de la fecha de fin del
  descuento. Cambia ahí para ajustar la promo.
