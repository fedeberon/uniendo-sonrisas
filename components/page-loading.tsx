export function PageLoading({ label = "Cargando información…" }: { label?: string }) {
  return <div className="page-loading" role="status" aria-live="polite"><span className="loading-spinner" aria-hidden="true"/><span>{label}</span></div>;
}
