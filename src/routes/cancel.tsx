import { createFileRoute, Link } from "@tanstack/react-router";
import { BuyButton } from "@/components/BuyButton";

export const Route = createFileRoute("/cancel")({
  head: () => ({
    meta: [
      { title: "Pago cancelado · Trading Assistant" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CancelPage,
});

function CancelPage() {
  return (
    <div className="min-h-screen bg-background px-6 py-20 text-foreground md:py-32">
      <div className="mx-auto max-w-2xl">
        <p className="eyebrow">Pago cancelado</p>
        <h1 className="serif-display mt-6 text-5xl md:text-6xl">
          Sin problema. <span className="italic">Cuando quieras</span>.
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
          No se realizó ningún cargo. Si tuviste algún inconveniente en el
          checkout, cuéntanos y lo resolvemos. Aquí tienes las dos vías:
        </p>

        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <BuyButton variant="primary" label="Intentar de nuevo" />
          <Link
            to="/"
            className="border-b border-foreground pb-1 text-sm font-medium hover:opacity-70"
          >
            Volver al inicio →
          </Link>
        </div>
      </div>
    </div>
  );
}
