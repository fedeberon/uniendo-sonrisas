import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { getMember, getMemberPayments } from "@/lib/server-data";
import { money } from "@/lib/data";

const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

function paymentMonths(payment: { period: string; periodKeys?: string[]; monthsCount?: number }) {
  if (payment.periodKeys?.length) return payment.periodKeys.map((key) => { const [year, month] = key.split("-"); return `${monthNames[Number(month) - 1] || month} ${year}`; });
  return payment.period.split(",").map((period) => period.trim()).filter(Boolean);
}

export default async function MemberPaymentsReport({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const member = await getMember(id); if (!member) notFound();
  const payments = await getMemberPayments(id); const total = payments.reduce((sum, payment) => sum + payment.amount, 0); const months = payments.reduce((sum, payment) => sum + (payment.monthsCount || 1), 0); const average = payments.length ? Math.round(total / payments.length) : 0;
  return <Shell current="Socios"><div className="content member-report"><Link className="back" href={`/socios/${member.id}`}>← Volver al detalle</Link><div className="eyebrow">Reporte individual</div><div className="member-report-head"><div><h1 className="title">Pagos de {member.name}</h1><p className="intro">Historial de aportes y comprobantes registrados.</p></div><Link className="secondary" href={`/pagos?memberId=${encodeURIComponent(member.id)}`}>+ Registrar pago</Link></div><div className="stats"><div className="card stat"><span className="stat-label">Total abonado</span><div className="stat-value">{money(total)}</div><div className="stat-trend">Pagos registrados</div></div><div className="card stat"><span className="stat-label">Períodos abonados</span><div className="stat-value">{months}</div><div className="stat-trend">Meses acumulados</div></div><div className="card stat"><span className="stat-label">Promedio por pago</span><div className="stat-value">{money(average)}</div><div className="stat-trend">Según historial</div></div></div><div className="card section-card member-report-table"><div className="card-head"><div className="card-title">Detalle de pagos</div><span className="link">{payments.length} comprobantes</span></div><div className="table-wrap"><table className="table"><thead><tr><th>Período</th><th>Meses</th><th>Fecha</th><th>Método</th><th>Importe</th><th>Estado</th><th></th></tr></thead><tbody>{payments.map((payment) => { const periods = paymentMonths(payment); return <tr key={payment.id}><td><div className="payment-period-list">{periods.map((period) => <span key={period}>{period}</span>)}</div></td><td>{periods.length || payment.monthsCount || 1}</td><td>{payment.paidAt}</td><td>{payment.method}</td><td>{money(payment.amount)}</td><td><span className={`status ${payment.receiptStatus === "Pendiente de revisión" ? "status-pending" : payment.receiptStatus === "Rechazado" ? "status-inactive" : "status-active"}`}>{payment.receiptStatus || payment.status}</span></td><td><Link className="link" href={`/pagos/comprobante/${payment.id}`}>Ver comprobante</Link></td></tr>; })}</tbody></table>{!payments.length && <div className="empty">Este socio todavía no tiene pagos registrados.</div>}</div></div></div></Shell>;
}
