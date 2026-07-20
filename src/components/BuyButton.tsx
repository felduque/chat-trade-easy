import { useState } from "react";

type Variant = "primary" | "ghost" | "large";

export function BuyButton({
  variant = "primary",
  label = "Comprar ahora",
  className = "",
}: {
  variant?: Variant;
  label?: string;
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    try {
      setState("loading");
      setError(null);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "No se pudo iniciar el checkout");
      }
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Error inesperado");
      setState("error");
    }
  }

  const base =
    "group inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60";

  const styles: Record<Variant, string> = {
    primary:
      "bg-accent-ink text-accent-ink-foreground px-6 py-3 text-sm hover:opacity-90",
    ghost:
      "border-b border-foreground pb-1 text-sm text-foreground hover:opacity-70",
    large:
      "bg-accent-ink text-accent-ink-foreground px-10 py-5 text-base tracking-tight hover:opacity-90",
  };

  const isLoading = state === "loading";

  return (
    <div className={variant === "ghost" ? "" : "inline-flex flex-col items-start gap-2"}>
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className={`${base} ${styles[variant]} ${className}`}
        aria-busy={isLoading}
      >
        {isLoading ? "Redirigiendo…" : label}
        {!isLoading && (
          <span
            aria-hidden
            className="translate-x-0 transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        )}
      </button>
      {state === "error" && error && (
        <p
          role="alert"
          className="mt-1 font-mono text-xs text-[oklch(0.5_0.18_25)]"
        >
          {error}. <button onClick={handleClick} className="underline">Reintentar</button>
        </p>
      )}
    </div>
  );
}
