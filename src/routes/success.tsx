import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { getCheckoutSession } from "@/lib/checkout.functions";

const searchSchema = z.object({
  session_id: z.string().optional(),
});

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
  const { session_id } = Route.useSearch();
  const fetchSession = useServerFn(getCheckoutSession);

  const { data, isLoading, error } = useQuery({
    queryKey: ["checkout-session", session_id],
    queryFn: () => fetchSession({ data: { sessionId: session_id! } }),
    enabled: !!session_id,
    retry: 1,
  });

  const paid = data?.paymentStatus === "paid";

  return (
    <div className="min-h-screen bg-background px-6 py-20 text-foreground md:py-32">
      <div className="mx-auto max-w-2xl">
        <p className="eyebrow">
          {isLoading ? "Verificando pago…" : paid ? "Pago confirmado" : "Estado del pago"}
        </p>
        <h1 className="serif-display mt-6 text-5xl md:text-6xl">
          {paid ? (
            <>Gracias. Ya <span className="italic text-accent-ink">eres parte</span>.</>
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
              <span className="text-muted-foreground">Correo</span>
              <span>{data.email ?? "—"}</span>
              <span className="text-muted-foreground">Total</span>
              <span>
                {data.amountTotal != null && data.currency
                  ? `${(data.amountTotal / 100).toFixed(2)} ${data.currency.toUpperCase()}`
                  : "—"}
              </span>
              <span className="text-muted-foreground">Estado</span>
              <span>{data.paymentStatus}</span>
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
