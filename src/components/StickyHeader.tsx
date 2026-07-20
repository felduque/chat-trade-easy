import { useEffect, useState } from "react";
import { BuyButton } from "./BuyButton";

export function StickyHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md transition-colors duration-200 ${
        scrolled
          ? "border-b border-rule bg-background/85"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4 md:px-10">
        <a
          href="/"
          className="serif-display text-xl tracking-tight text-foreground"
          style={{ fontWeight: 600 }}
        >
          Dg<span className="text-muted-foreground">-</span>Developers
        </a>
        <div
          className={`flex items-center gap-6 transition-opacity duration-200 ${
            scrolled ? "opacity-100" : "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto"
          }`}
        >
          <a
            href="#especificaciones"
            className="eyebrow hidden hover:text-foreground md:inline"
          >
            Especificaciones
          </a>
          <BuyButton variant="primary" label="Comprar" />
        </div>
      </div>
    </header>
  );
}
