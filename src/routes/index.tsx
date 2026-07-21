import { createFileRoute, Link } from "@tanstack/react-router";
import { StickyHeader } from "@/components/StickyHeader";
import { BuyButton } from "@/components/BuyButton";
import { ChatMockup } from "@/components/ChatMockup";
import { Reveal } from "@/components/Reveal";
import {
  FULL_PRICE_USD,
  PROMO_PRICE_USD,
  PROMO_END_ISO,
  isPromoActive,
  discountPercent,
} from "@/lib/pricing";

export const Route = createFileRoute("/")({
  component: Landing,
});

function SectionLabel({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4">
      <span className="font-mono text-xs text-muted-foreground">{n}</span>
      <span className="eyebrow">{title}</span>
    </div>
  );
}

function PriceBlock() {
  const promo = isPromoActive();
  const endDate = new Date(PROMO_END_ISO).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (!promo) {
    return (
      <div className="mt-12 flex flex-col items-center gap-2">
        <div className="serif-display text-6xl md:text-7xl">
          ${FULL_PRICE_USD}
          <span className="ml-2 font-mono text-sm text-muted-foreground">USD</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 flex flex-col items-center gap-3">
      <div className="inline-flex items-center gap-2 border border-accent-ink px-3 py-1 font-mono text-xs uppercase tracking-widest text-accent-ink">
        −{discountPercent()}% · Hasta el {endDate}
      </div>
      <div className="flex items-baseline gap-4">
        <span className="serif-display text-6xl md:text-7xl text-accent-ink">
          ${PROMO_PRICE_USD}
        </span>
        <span className="serif-display text-3xl text-muted-foreground line-through decoration-1">
          ${FULL_PRICE_USD}
        </span>
        <span className="font-mono text-sm text-muted-foreground">USD</span>
      </div>
      <p className="font-mono text-xs text-muted-foreground">
        Precio de lanzamiento por tiempo limitado.
      </p>
    </div>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <StickyHeader />

      {/* 01 — HERO */}
      <section className="mx-auto max-w-[1200px] px-6 pt-10 pb-24 md:px-10 md:pt-16 md:pb-32">
        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <SectionLabel n="01" title="Trading Assistant" />
            <h1 className="serif-display mt-8 text-5xl md:text-7xl">
              Opera cripto{" "}
              <span className="italic text-accent-ink">hablando</span> con
              tu asistente de IA.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Un servidor MCP que conecta Claude Desktop, Cursor y clientes MCP
              con los mercados cripto. Precios, tu cuenta y órdenes — en
              lenguaje natural. Las llaves API nunca salen de tu equipo.
            </p>

            <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <BuyButton variant="large" label="Comprar ahora" />
              <a
                href="#que-incluye"
                className="eyebrow border-b border-transparent pb-1 transition-colors hover:border-foreground hover:text-foreground"
              >
                Ver qué incluye →
              </a>
            </div>

            <p className="mt-10 font-mono text-xs tracking-wide text-muted-foreground">
              No-custodio · Licencia de por vida · Sin suscripción
            </p>
          </div>

          <div className="md:col-span-5 md:pt-16">
            <ChatMockup />
          </div>
        </div>
      </section>

      {/* 02 — PROMPTS */}
      <section className="rule-t">
        <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-28">
          <Reveal>
            <SectionLabel n="02" title="Solo escribe cosas como…" />
            <h2 className="serif-display mt-6 max-w-3xl text-4xl md:text-5xl">
              Sin comandos, sin dashboards. Solo{" "}
              <span className="italic">conversación</span>.
            </h2>
          </Reveal>

          <div className="mt-16 grid gap-px bg-rule md:grid-cols-2">
            {[
              {
                prompt: "¿A cuánto está el Bitcoin?",
                caption: "Precio en vivo con variación 24h.",
              },
              {
                prompt: "Muéstrame mi balance en Binance.",
                caption: "Cuenta spot y futuros, en tu pantalla.",
              },
              {
                prompt: "Prepara una orden de 100 USDT en ETH.",
                caption: "Confirmación en dos pasos antes de ejecutar.",
              },
              {
                prompt: "¿Cómo va mi posición larga en SOL con 5×?",
                caption: "PnL, funding, liquidación estimada.",
              },
            ].map((p, i) => (
              <Reveal key={p.prompt} className="bg-background">
                <div className="flex h-full flex-col justify-between gap-8 p-8 md:p-10">
                  <p className="serif-display text-2xl md:text-3xl">
                    <span className="text-muted-foreground">"</span>
                    {p.prompt}
                    <span className="text-muted-foreground">"</span>
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px flex-1 bg-rule" />
                    <span className="eyebrow">{p.caption}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 03 — QUÉ INCLUYE */}
      <section id="que-incluye" className="rule-t bg-surface">
        <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-28">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <SectionLabel n="03" title="Qué incluye" />
              <h2 className="serif-display mt-6 text-4xl md:text-5xl">
                Todo lo que necesitas para operar, nada de lo que sobra.
              </h2>
            </div>
            <div className="md:col-span-8">
              <div className="grid gap-px bg-rule md:grid-cols-2">
                {[
                  {
                    t: "Mercado en vivo",
                    d: "Precios, órdenes de libro, velas y volúmenes al momento.",
                  },
                  {
                    t: "Tu cuenta, siempre a mano",
                    d: "Balances, órdenes abiertas e historial en spot y futuros.",
                  },
                  {
                    t: "Operar con control",
                    d: "Órdenes market, limit y stop. Apalancamiento y márgenes.",
                  },
                  {
                    t: "Modo práctica",
                    d: "Testnet incluida para probar sin poner un solo dólar.",
                  },
                  {
                    t: "+60 herramientas",
                    d: "Spot, futuros, funding, conversiones, transferencias.",
                  },
                  {
                    t: "Llaves solo tuyas",
                    d: "Las claves API viven en tu equipo. Nunca en nuestros servidores.",
                  },
                ].map((f) => (
                  <div key={f.t} className="bg-surface p-8">
                    <h3 className="serif-display text-2xl">{f.t}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {f.d}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — SEGURO POR DISEÑO */}
      <section className="rule-t">
        <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-28">
          <SectionLabel n="04" title="Seguro por diseño" />
          <h2 className="serif-display mt-6 max-w-3xl text-4xl md:text-5xl">
            Tú tienes las llaves. Nosotros{" "}
            <span className="italic text-accent-ink">nunca</span>.
          </h2>

          <div className="mt-16 grid gap-16 md:grid-cols-3">
            {[
              {
                n: "01",
                t: "No-custodio",
                d: "El servidor MCP corre en tu máquina. Tus API keys jamás salen de ella — ni pasan por nuestros servidores, porque no hay servidores nuestros.",
              },
              {
                n: "02",
                t: "Confirmación en dos pasos",
                d: "Cualquier acción que mueva dinero real requiere una confirmación explícita tuya después de ver los detalles. Sin excepciones.",
              },
              {
                n: "03",
                t: "Modo solo-lectura",
                d: "¿Quieres consultar sin poder operar? Configura llaves con permisos de lectura únicamente. El asistente respeta lo que Binance permite.",
              },
            ].map((b, i) => (
              <div
                key={b.n}
                className={`md:pl-8 ${i > 0 ? "md:border-l md:border-rule" : ""}`}
              >
                <span className="font-mono text-sm text-accent-ink">{b.n}</span>
                <h3 className="serif-display mt-4 text-2xl">{b.t}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {b.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 05 — LISTO EN 4 PASOS */}
      <section className="rule-t bg-surface">
        <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-28">
          <SectionLabel n="05" title="Listo en 4 pasos" />
          <h2 className="serif-display mt-6 max-w-3xl text-4xl md:text-5xl">
            Sin escribir una línea de código.
          </h2>

          <ol className="mt-16 grid gap-px bg-rule md:grid-cols-4">
            {[
              {
                t: "Instala Node.js",
                d: "Un solo instalador oficial. 2 minutos.",
              },
              {
                t: "Descomprime el paquete",
                d: "Descárgalo tras la compra, extrae la carpeta.",
              },
              {
                t: "Responde 4 preguntas",
                d: "Exchange, llaves API, testnet sí o no, listo.",
              },
              {
                t: "Reinicia tu asistente",
                d: "Claude Desktop o Cursor detecta el MCP y ya está.",
              },
            ].map((s, i) => (
              <li key={s.t} className="bg-surface p-8">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-2xl text-accent-ink">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px flex-1 bg-rule" />
                </div>
                <h3 className="serif-display mt-6 text-xl">{s.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {s.d}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 06 — ESPECIFICACIONES */}
      <section id="especificaciones" className="rule-t">
        <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-28">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <SectionLabel n="06" title="Especificaciones" />
              <h2 className="serif-display mt-6 text-4xl md:text-5xl">
                Ficha técnica.
              </h2>
            </div>
            <div className="md:col-span-8">
              <table className="w-full border-collapse">
                <tbody className="font-mono text-sm">
                  {[
                    ["Compatibilidad", "Claude Desktop · Cursor · clientes MCP"],
                    ["Exchanges", "Binance (más en camino)"],
                    ["Modos", "Real · Testnet · Solo-lectura"],
                    ["Herramientas", "+60 funciones MCP"],
                    ["Plataformas", "Windows 10/11 · macOS 12+"],
                    ["Requisitos", "Node.js 18 o superior"],
                    ["Licencia", "De por vida · Un pago"],
                  ].map(([k, v]) => (
                    <tr
                      key={k}
                      className="border-b border-rule last:border-b-0"
                    >
                      <th
                        scope="row"
                        className="w-1/3 py-4 pr-6 text-left font-normal text-muted-foreground"
                      >
                        {k}
                      </th>
                      <td className="py-4 text-foreground">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 07 — FAQ */}
      <section className="rule-t bg-surface">
        <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-28">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <SectionLabel n="07" title="Preguntas" />
              <h2 className="serif-display mt-6 text-4xl md:text-5xl">
                Lo que suelen preguntar.
              </h2>
            </div>
            <div className="md:col-span-8">
              {[
                {
                  q: "¿Necesito saber programar?",
                  a: "No. La instalación es un instalador de Node, descomprimir un ZIP y responder cuatro preguntas en un asistente guiado. Si sabes instalar una app, sabes esto.",
                },
                {
                  q: "¿Es seguro darle mis llaves?",
                  a: "Tus llaves API se guardan localmente, cifradas en tu equipo. El servidor MCP corre en tu máquina. Nosotros no tenemos servidor: no hay a dónde puedan filtrarse. Además puedes crear llaves con permisos limitados o usar la testnet.",
                },
                {
                  q: "¿Con qué asistentes funciona?",
                  a: "Claude Desktop y Cursor de forma nativa. Cualquier otro cliente compatible con el protocolo MCP también funciona.",
                },
                {
                  q: "¿La licencia caduca?",
                  a: "No. Un solo pago, tuya para siempre, incluidas las actualizaciones futuras del producto.",
                },
              ].map((f, i) => (
                <details
                  key={f.q}
                  className="group border-b border-rule py-6 last:border-b-0"
                >
                  <summary className="flex cursor-pointer list-none items-baseline gap-6">
                    <span className="font-mono text-xs text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="serif-display flex-1 text-2xl md:text-3xl">
                      {f.q}
                    </span>
                    <span
                      aria-hidden
                      className="font-mono text-xl text-muted-foreground transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-4 max-w-2xl pl-10 text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 08 — CTA CIERRE */}
      <section className="rule-t">
        <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-10 md:py-40">
          <div className="text-center">
            <SectionLabel n="08" title="Un pago, tuyo para siempre" />
            <h2 className="serif-display mx-auto mt-8 max-w-4xl text-5xl md:text-7xl">
              Habla con los mercados{" "}
              <span className="italic text-accent-ink">como hablas con tu IA</span>.
            </h2>
            <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Instálalo hoy. Sin suscripciones, sin custodios, sin fricción.
            </p>

            <PriceBlock />

            <div className="mt-10 flex flex-col items-center gap-4">
              <BuyButton variant="large" label="Comprar Trading Assistant" />
              <p className="font-mono text-xs text-muted-foreground">
                Pago único · Licencia de por vida · Reembolso 14 días
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="rule-t bg-surface">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10">
          <div className="flex items-baseline gap-4">
            <span
              className="serif-display text-lg"
              style={{ fontWeight: 600 }}
            >
              Dg-Developers
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              © {new Date().getFullYear()}
            </span>
          </div>
          <nav className="flex gap-6 font-mono text-xs text-muted-foreground">
            <Link to="/guia" className="hover:text-foreground">
              Guía de instalación
            </Link>
            <a href="#" className="hover:text-foreground">
              Términos
            </a>
            <a href="#" className="hover:text-foreground">
              Soporte
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
