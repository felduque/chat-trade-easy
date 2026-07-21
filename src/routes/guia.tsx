import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/guia")({
  head: () => ({
    meta: [
      { title: "Guía de instalación · Trading Assistant" },
      {
        name: "description",
        content:
          "Instala el Trading Assistant en Claude Desktop, ChatGPT, Kimi, Cursor u otro cliente MCP en menos de 10 minutos. Sin conocimientos técnicos.",
      },
      { property: "og:title", content: "Guía de instalación · Trading Assistant" },
      {
        property: "og:description",
        content:
          "Pasos claros para conectar tu asistente favorito (Claude, ChatGPT, Kimi, Cursor…) con los mercados cripto.",
      },
    ],
  }),
  component: GuidePage,
});

const CLIENTS = [
  { name: "Claude Desktop", auto: true },
  { name: "ChatGPT (escritorio)", auto: true },
  { name: "Kimi", auto: true },
  { name: "Cursor", auto: true },
  { name: "Otros clientes MCP", auto: false },
];

const MANUAL_JSON = `{
  "mcpServers": {
    "trading-assistant": {
      "command": "node",
      "args": ["RUTA/AL/trading-assistant/dist/index.js"],
      "env": {
        "LICENSE_KEY": "TU-CLAVE-DE-LICENCIA",
        "BINANCE_API_KEY": "TU-API-KEY-DE-BINANCE",
        "BINANCE_API_SECRET": "TU-API-SECRET-DE-BINANCE"
      }
    }
  }
}`;

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rule-t py-12 md:py-16">
      <div className="grid gap-8 md:grid-cols-[auto_1fr] md:gap-12">
        <div>
          <span
            className="serif-display block text-7xl text-accent-ink md:text-8xl"
            style={{ fontWeight: 600 }}
          >
            {String(n).padStart(2, "0")}
          </span>
        </div>
        <div>
          <h2 className="serif-display text-3xl md:text-4xl" style={{ fontWeight: 600 }}>
            {title}
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-foreground/85 md:text-lg">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

function GuidePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <header className="rule-b">
        <div className="mx-auto flex max-w-[1000px] items-center justify-between px-6 py-6 md:px-10">
          <Link
            to="/"
            className="serif-display text-xl tracking-tight"
            style={{ fontWeight: 600 }}
          >
            Dg<span className="text-muted-foreground">-</span>Developers
          </Link>
          <Link
            to="/"
            className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
          >
            ← Inicio
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-[1000px] px-6 pb-16 pt-20 md:px-10 md:pb-24 md:pt-28">
        <p className="eyebrow">Manual del propietario · v1</p>
        <h1
          className="serif-display mt-6 text-6xl md:text-8xl"
          style={{ fontWeight: 600 }}
        >
          Guía de <span className="italic text-accent-ink">instalación</span>
        </h1>
        <p className="mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
          De la compra a tu primera orden en unos <b className="text-foreground">10 minutos</b>.
          Sin código, sin terminal, sin jerga. Si sabes instalar una app, sabes esto.
        </p>

        {/* Compatibilidad */}
        <div className="mt-12 rule-t rule-b border-x border-rule bg-surface p-6 md:p-8">
          <p className="eyebrow">Compatible con</p>
          <ul className="mt-4 grid gap-3 font-mono text-sm md:grid-cols-2">
            {CLIENTS.map((c) => (
              <li key={c.name} className="flex items-center justify-between gap-4">
                <span>{c.name}</span>
                <span
                  className={
                    c.auto
                      ? "text-accent-ink"
                      : "text-muted-foreground"
                  }
                >
                  {c.auto ? "config automática" : "config manual (JSON)"}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            Es un servidor <b className="text-foreground">MCP</b>: funciona con cualquier
            cliente compatible. La instalación del programa es <b className="text-foreground">idéntica</b> para todos;
            solo cambia el archivo de configuración de cada cliente — y de eso se
            encarga el instalador guiado por ti.
          </p>
        </div>
      </section>

      {/* PASOS */}
      <div className="mx-auto max-w-[1000px] px-6 md:px-10">
        <Step n={0} title="Antes de empezar">
          <p>Ten a mano estas tres cosas:</p>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              Tu <b>clave de licencia</b>. Llega por correo tras la compra
              (revisa spam si tarda).
            </li>
            <li>
              Uno de los <b>asistentes compatibles</b>: Claude Desktop, ChatGPT
              (escritorio, con soporte MCP), Kimi, Cursor u otro cliente MCP.
            </li>
            <li>
              Tus <b>llaves API de Binance</b>. Para probar sin arriesgar dinero
              real existe la testnet gratuita:{" "}
              <a
                href="https://testnet.binance.vision"
                target="_blank"
                rel="noreferrer"
                className="border-b border-foreground pb-0.5 hover:opacity-70"
              >
                testnet.binance.vision
              </a>
              .
            </li>
          </ul>
          <p className="text-sm text-muted-foreground">
            El asistente <b>nunca</b> mueve fondos por su cuenta: cada orden pide
            tu confirmación. Aun así, empieza en testnet.
          </p>
        </Step>

        <Step n={1} title="Instala Node.js (una sola vez)">
          <p>
            Node.js es el motor que ejecuta el programa. Se instala una vez y te
            olvidas.
          </p>
          <ol className="ml-5 list-decimal space-y-2">
            <li>
              Ve a{" "}
              <a
                href="https://nodejs.org"
                target="_blank"
                rel="noreferrer"
                className="border-b border-foreground pb-0.5 hover:opacity-70"
              >
                nodejs.org
              </a>{" "}
              y descarga la versión <b>LTS</b> (el botón grande de la izquierda).
            </li>
            <li>
              Abre el instalador y haz clic en <b>Siguiente → Siguiente → Finalizar</b>.
              No cambies ninguna opción.
            </li>
            <li>
              ¿Ya lo tenías instalado? Perfecto, sáltate este paso.
            </li>
          </ol>
        </Step>

        <Step n={2} title="Descarga y descomprime el programa">
          <p>
            En el correo de compra encontrarás el <b>enlace de descarga</b>. Es
            un archivo <span className="font-mono text-sm">.zip</span>.
          </p>
          <ol className="ml-5 list-decimal space-y-2">
            <li>Guárdalo en una carpeta a la que no vayas a mover (ej. tu carpeta de usuario).</li>
            <li>Haz clic derecho → <b>Extraer aquí</b>.</li>
            <li>
              Tendrás una carpeta llamada{" "}
              <span className="font-mono text-sm">trading-assistant</span>. No la
              muevas después.
            </li>
          </ol>
        </Step>

        <Step n={3} title="Ejecuta el instalador guiado">
          <p>
            Dentro de la carpeta, haz doble clic en{" "}
            <span className="font-mono text-sm">instalar</span> (
            <span className="font-mono text-sm">.cmd</span> en Windows,{" "}
            <span className="font-mono text-sm">.command</span> en Mac).
          </p>
          <p>El asistente te hará cuatro preguntas, en este orden:</p>
          <ol className="ml-5 list-decimal space-y-2">
            <li>Tu <b>clave de licencia</b> (cópiala del correo).</li>
            <li>Tu <b>API Key de Binance</b>.</li>
            <li>Tu <b>API Secret de Binance</b>.</li>
            <li>
              Qué <b>cliente</b> usas: Claude, ChatGPT, Kimi, Cursor u{" "}
              <i>Otro</i>.
            </li>
          </ol>
          <p>
            Si eliges Claude, ChatGPT, Kimi o Cursor, el instalador{" "}
            <b>encuentra su archivo de configuración y lo edita solo</b>. No tienes
            que abrir nada más.
          </p>
        </Step>

        <Step n={4} title="Reinicia tu asistente y saluda">
          <p>Cierra por completo tu asistente (no minimizarlo, cerrarlo) y vuelve a abrirlo.</p>
          <p>
            Escríbele algo como:
          </p>
          <blockquote className="rule-t rule-b border-x border-rule bg-surface p-5 font-mono text-sm">
            ¿Cuánto está Bitcoin ahora mismo?
          </blockquote>
          <p>
            Si te responde con un precio, ya está funcionando. Puedes pedirle
            saldo, órdenes, gráficos o abrir una posición — siempre te pedirá
            confirmación antes de mover fondos.
          </p>
        </Step>

        <Step n={5} title="¿Usas un cliente que el instalador no reconoce?">
          <p>
            Elige <i>Otro</i> en el paso 3. El instalador te mostrará este
            bloque JSON: cópialo tal cual y pégalo en el archivo de configuración
            MCP de tu cliente (cada cliente lo llama distinto — busca «MCP servers»
            en sus ajustes).
          </p>
          <pre className="rule-t rule-b border-x border-rule bg-foreground text-background overflow-x-auto p-5 font-mono text-xs leading-relaxed">
            {MANUAL_JSON}
          </pre>
          <p className="text-sm text-muted-foreground">
            Reemplaza las tres líneas en <span className="font-mono">env</span>{" "}
            por tus valores reales y ajusta la ruta de{" "}
            <span className="font-mono">args</span> a donde extrajiste la carpeta.
          </p>
        </Step>

        {/* TROUBLESHOOTING */}
        <section className="rule-t py-12 md:py-16">
          <p className="eyebrow">Si algo no va</p>
          <h2
            className="serif-display mt-4 text-4xl md:text-5xl"
            style={{ fontWeight: 600 }}
          >
            Problemas comunes
          </h2>
          <dl className="mt-10 divide-y divide-rule">
            {[
              {
                q: "Mi asistente no ve el «trading-assistant»",
                a: "Ciérralo del todo (revisa la bandeja del sistema) y vuelve a abrirlo. Windows y Mac a veces dejan el proceso corriendo tras cerrar la ventana.",
              },
              {
                q: "El instalador dice «node no se reconoce»",
                a: "Node.js no terminó de instalarse. Reinicia el ordenador y vuelve a lanzar el instalador.",
              },
              {
                q: "Me devuelve un error de credenciales de Binance",
                a: "Comprueba que copiaste la API Key y el Secret sin espacios al inicio o al final. En testnet, asegúrate de generar las llaves en testnet.binance.vision, no en el Binance normal.",
              },
              {
                q: "¿Puedo cambiar de cliente más adelante?",
                a: "Sí. Vuelve a ejecutar el instalador y elige otro cliente; conserva o reemplaza la configuración anterior según prefieras.",
              },
            ].map((f) => (
              <div key={f.q} className="grid gap-2 py-5 md:grid-cols-[1fr_2fr] md:gap-10">
                <dt className="serif-display text-lg" style={{ fontWeight: 600 }}>
                  {f.q}
                </dt>
                <dd className="text-base leading-relaxed text-muted-foreground">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* SOPORTE */}
        <section className="rule-t py-12 md:py-16">
          <div className="max-w-2xl">
            <p className="eyebrow">¿Aún atascado?</p>
            <h2
              className="serif-display mt-4 text-4xl md:text-5xl"
              style={{ fontWeight: 600 }}
            >
              Escríbenos.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              Responde al correo de compra con una captura del error y te
              ayudamos personalmente. Somos personas, no un formulario.
            </p>
            <div className="mt-8">
              <Link
                to="/"
                className="border-b border-foreground pb-1 text-sm font-medium hover:opacity-70"
              >
                ← Volver al inicio
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="rule-t mt-16 bg-surface">
        <div className="mx-auto flex max-w-[1000px] flex-col items-start gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10">
          <div className="flex items-baseline gap-4">
            <span className="serif-display text-lg" style={{ fontWeight: 600 }}>
              Dg-Developers
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              © {new Date().getFullYear()}
            </span>
          </div>
          <nav className="flex gap-6 font-mono text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Inicio
            </Link>
            <Link to="/guia" className="hover:text-foreground">
              Guía
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
