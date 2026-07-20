export function ChatMockup() {
  return (
    <div className="relative">
      {/* Etiqueta tabular */}
      <div className="eyebrow absolute -top-6 left-0">
        Demo · Claude Desktop
      </div>

      <div className="rule-t rule-b border-x border-rule bg-surface">
        {/* Barra de ventana */}
        <div className="flex items-center gap-2 border-b border-rule px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.72_0.16_25)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.82_0.14_85)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.72_0.12_150)]" />
          <span className="ml-3 font-mono text-[11px] text-muted-foreground">
            trading-assistant · mcp
          </span>
        </div>

        <div className="space-y-4 p-6">
          {/* Usuario */}
          <div className="flex justify-end">
            <div className="max-w-[80%] border border-rule bg-background px-4 py-2.5 text-sm">
              ¿a cuánto está el Bitcoin?
            </div>
          </div>

          {/* Asistente */}
          <div className="space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Asistente
            </p>
            <p className="text-sm leading-relaxed">
              Ahora mismo <span className="font-serif italic">Bitcoin</span> cotiza a:
            </p>

            {/* Card de precio */}
            <div className="rule-t rule-b border-x border-accent-ink/20 bg-background">
              <div className="grid grid-cols-[auto_1fr_auto] items-baseline gap-4 px-4 py-4">
                <div className="font-mono text-xs text-muted-foreground">BTC/USDT</div>
                <div className="font-serif text-3xl tabular-nums tracking-tight">
                  $68,412.<span className="text-muted-foreground">30</span>
                </div>
                <div className="font-mono text-xs text-[oklch(0.52_0.14_150)]">
                  +2.14% 24h
                </div>
              </div>
              <div className="grid grid-cols-3 border-t border-rule">
                {[
                  ["Vol 24h", "$34.1B"],
                  ["Máx 24h", "$69,204"],
                  ["Mín 24h", "$66,980"],
                ].map(([k, v]) => (
                  <div key={k} className="border-l border-rule px-4 py-2 first:border-l-0">
                    <div className="eyebrow">{k}</div>
                    <div className="mt-1 font-mono text-xs">{v}</div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Fuente: Binance · consulta en vivo vía servidor MCP local.
            </p>
          </div>

          {/* Usuario 2 */}
          <div className="flex justify-end">
            <div className="max-w-[80%] border border-rule bg-background px-4 py-2.5 text-sm">
              prepara una orden de 100 USDT en ETH
            </div>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Confirmación requerida
            </p>
            <p className="mt-2 text-sm">
              Voy a comprar <span className="font-mono">≈ 0.0289 ETH</span> por{" "}
              <span className="font-mono">100 USDT</span> en Binance Spot. Responde{" "}
              <span className="font-mono">confirmar</span> para ejecutar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
