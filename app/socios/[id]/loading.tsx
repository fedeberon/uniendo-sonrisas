import { PageLoading } from "@/components/page-loading";

export default function Loading() {
  return <main className="route-loading" role="status" aria-live="polite"><PageLoading label="Cargando detalle del socio…"/></main>;
}
