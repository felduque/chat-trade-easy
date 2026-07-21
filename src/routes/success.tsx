import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { verifyCreemRedirect } from "@/lib/checkout.functions";

// Creem redirige con estos params (más `signature`). Aceptamos cualquier
// combinación — la verificación real la hace el server con la API key.
const searchSchema = z
  .object({
    checkout_id: z.string().optional(),
    order_id: z.string().optional(),
    customer_id: z.string().optional(),
    subscription_id: z.string().optional(),
    product_id: z.string().optional(),
    request_id: z.string().optional(),
    signature: z.string().optional(),
  })
  .passthrough();

export const Route = createFileRoute("/success")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Gracias por tu compra · Trading Assistant" },
      { name: "description", content: "Tu compra fue exitosa." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const search = Route.useSearch() as Record<string, string | undefined>;
  const verifyFn = useServerFn(verifyCreemRedirect);

  const hasSignature = !!search.signature;

  const params: Record<string, string> = Object.fromEntries(
    Object.entries(search).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["creem-verify", search.signature, search.order_id],
    queryFn: () => verifyFn({ data: { params } }),
    enabled: hasSignature,
    retry: 1,
  });

  const verified = data?.verified === true;

  return (
    <div className="min-h-screen bg-background px-6 py-20 text-foreground md:py-32">
      <div className="mx-auto max-w-2xl">
        <p className="eyebrow">
          {!hasSignature
            ? "Estado del pago"
            : isLoading
              ? "Verificando pago…"
              : verified
                ? "Pago confirmado"
                : "Revisando pago"}
        </p>
        <h1 className="serif-display mt-6 text-5xl md:text-6xl">
          {verified ? (
            <>
              Gracias. Ya <span className="italic text-accent-ink">eres parte</span>.
            </>
          ) : isLoading ? (
            "Confirmando tu compra…"
          ) : (
            "Estamos revisando tu pago"
          )}
        </h1>

        {error && (
          <p className="mt-6 font-mono text-sm text-[oklch(0.5_0.18_25)]">
            No pudimos verificar la sesión. Si el cargo apareció en tu banco, tu
            licencia llegará igual por correo.
          </p>
        )}

        {data && (
          <div className="mt-10 rule-t rule-b border-x border-rule bg-surface p-6 font-mono text-sm">
            <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
              <span className="text-muted-foreground">Orden</span>
              <span>{data.orderId ?? "—"}</span>
              <span className="text-muted-foreground">Checkout</span>
              <span>{data.checkoutId ?? "—"}</span>
              <span className="text-muted-foreground">Firma</span>
              <span>{verified ? "válida" : "no verificada"}</span>
            </div>
          </div>
        )}

        <div className="mt-10 space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>
            En los próximos minutos recibirás un correo con tu{" "}
            <span className="text-foreground">licencia</span> y el{" "}
            <span className="text-foreground">enlace de descarga</span> del Trading Assistant.
          </p>
          <p>
            Si no lo ves, revisa tu carpeta de spam. Cualquier duda, respóndenos
            desde ese mismo correo y te contestamos personalmente.
          </p>
        </div>

        <div className="mt-10 rule-t border-x border-rule bg-surface p-6">
          <p className="eyebrow">Siguiente paso</p>
          <h2
            className="serif-display mt-3 text-2xl md:text-3xl"
            style={{ fontWeight: 600 }}
          >
            Instálalo en 10 minutos
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Guía paso a paso para Claude, ChatGPT, Kimi, Cursor u otro cliente MCP.
          </p>
          <div className="mt-5">
            <Link
              to="/guia"
              className="inline-flex items-center gap-2 bg-foreground px-5 py-3 font-mono text-xs uppercase tracking-[0.18em] text-background hover:opacity-90"
            >
              Abrir la guía →
            </Link>
          </div>
        </div>

        <div className="mt-12">
          <Link
            to="/"
            className="border-b border-foreground pb-1 text-sm font-medium hover:opacity-70"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
