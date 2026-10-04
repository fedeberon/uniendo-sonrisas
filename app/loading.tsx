export default function Loading() {
  return <main className="route-loading" role="status" aria-live="polite" aria-label="Cargando página"><div className="route-loading-card"><span className="loading-mark">✦</span><div><strong>Cargando</strong><span>Estamos preparando la información…</span></div><span className="loading-spinner" aria-hidden="true" /></div></main>;
}
