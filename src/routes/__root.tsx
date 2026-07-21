import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <p className="eyebrow">Error 404</p>
        <h1 className="serif-display mt-4 text-6xl">Página no encontrada</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          La página que buscas no existe o fue movida.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 border-b border-foreground pb-1 text-sm font-medium text-foreground transition-opacity hover:opacity-70"
          >
            Volver al inicio →
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <p className="eyebrow">Algo falló</p>
        <h1 className="serif-display mt-4 text-5xl">Esta página no cargó</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Hubo un problema. Puedes reintentar o volver al inicio.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="border-b border-foreground pb-1 text-sm font-medium text-foreground transition-opacity hover:opacity-70"
          >
            Reintentar
          </button>
          <a
            href="/"
            className="border-b border-transparent pb-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title: "Trading Assistant — Opera cripto hablando con tu IA · Dg-Developers",
      },
      {
        name: "description",
        content:
          "Servidor MCP que conecta Claude Desktop, Cursor y clientes MCP con los mercados cripto. Consulta precios, revisa tu cuenta y opera en lenguaje natural. No-custodio. Licencia de por vida.",
      },
      { name: "author", content: "Dg-Developers" },
      {
        property: "og:title",
        content: "Trading Assistant — Opera cripto hablando con tu IA",
      },
      {
        property: "og:description",
        content:
          "Un servidor MCP no-custodio para Claude Desktop y Cursor. Precios, cuenta y órdenes en lenguaje natural. Licencia de por vida.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://dg-developers.dev/icon-512.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://dg-developers.dev/icon-512.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
