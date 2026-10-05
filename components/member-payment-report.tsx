"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { money, type Member, type Payment } from "@/lib/data";

const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const prices = [18500, 18500, 19500, 19500, 19500, 21000, 21000, 21000, 22500, 22500, 22500, 22500];

function paymentKeys(payment: Payment) {
  if (payment.periodKeys?.length) return payment.periodKeys;
  return months.flatMap((month, index) => payment.period.toLowerCase().includes(month.toLowerCase()) && payment.period.includes("2026") ? [`2026-${String(index + 1).padStart(2, "0")}`] : []);
}

export function MemberPaymentReport({ member, payments }: { member: Member; payments: Payment[] }) {
  const [year, setYear] = useState(2026);
  const paidKeys = useMemo(() => new Set(payments.flatMap(paymentKeys)), [payments]);
  const yearMonths = months.map((label, index) => ({ label, key: `${year}-${String(index + 1).padStart(2, "0")}`, amount: prices[index], paid: paidKeys.has(`${year}-${String(index + 1).padStart(2, "0")}`) }));
  const paidCount = yearMonths.filter((month) => month.paid).length;
  const pendingCount = yearMonths.length - paidCount;
  const pendingAmount = yearMonths.filter((month) => !month.paid).reduce((sum, month) => sum + month.amount, 0);
  const total = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidMonths = payments.reduce((sum, payment) => sum + (payment.periodKeys?.length || payment.monthsCount || 1), 0);
  const average = payments.length ? Math.round(total / payments.length) : 0;

  return <div className="content member-report"><Link className="back" href={`/socios/${member.id}`}>← Volver al detalle</Link><div className="eyebrow">Reporte individual</div><div className="member-report-head"><div><h1 className="title">Pagos de {member.name}</h1><p className="intro">Consultá los meses abonados, períodos pendientes e historial de comprobantes.</p></div><Link className="primary" href={`/pagos?memberId=${encodeURIComponent(member.id)}`}>+ Registrar pago</Link></div><div className="stats"><div className="card stat"><span className="stat-label">Total abonado</span><div className="stat-value">{money(total)}</div><div className="stat-trend">Pagos registrados</div></div><div className="card stat"><span className="stat-label">Períodos abonados</span><div className="stat-value">{paidMonths}</div><div className="stat-trend">Meses acumulados</div></div><div className="card stat"><span className="stat-label">Promedio por pago</span><div className="stat-value">{money(average)}</div><div className="stat-trend">Según historial</div></div></div><section className="card annual-report-card"><div className="card-head"><div><div className="card-title">Estado de pagos</div><p className="modal-subtitle">{member.name}: períodos abonados y deuda estimada.</p></div><div className="annual-toolbar"><button type="button" className="secondary" onClick={() => setYear((value) => value - 1)} aria-label="Año anterior">←</button><strong>{year}</strong><button type="button" className="secondary" onClick={() => setYear((value) => value + 1)} aria-label="Año siguiente">→</button></div></div><div className="annual-counters"><div><strong className="summary-paid">{paidCount}</strong><span>Pagados en {year}</span></div><div><strong className="summary-debt">{pendingCount}</strong><span>Pendientes en {year}</span></div><div><strong>{money(pendingAmount)}</strong><span>Deuda estimada</span></div></div><div className="annual-month-grid report-month-grid">{yearMonths.map((month) => <div className={`annual-month ${month.paid ? "is-paid" : "is-pending"}`} key={month.key}><div><strong>{month.label}</strong><small>{month.paid ? "Pago registrado" : "Pendiente"}</small></div><b>{money(month.amount)}</b></div>)}</div><div className="report-legend"><span><i className="legend-paid"/> Pagado</span><span><i className="legend-pending"/> Pendiente</span></div></section><div className="card section-card member-report-table"><div className="card-head"><div className="card-title">Historial de pagos</div><span className="link">{payments.length} comprobantes</span></div><div className="table-wrap"><table className="table"><thead><tr><th>Período</th><th>Meses</th><th>Fecha</th><th>Método</th><th>Importe</th><th>Estado</th><th></th></tr></thead><tbody>{payments.map((payment) => <tr key={payment.id}><td>{payment.period}</td><td>{payment.periodKeys?.length || payment.monthsCount || 1}</td><td>{payment.paidAt}</td><td>{payment.method}</td><td>{money(payment.amount)}</td><td><span className={`status ${payment.receiptStatus === "Pendiente de revisión" ? "status-pending" : payment.receiptStatus === "Rechazado" ? "status-inactive" : "status-active"}`}>{payment.receiptStatus || payment.status}</span></td><td><Link className="link" href={`/pagos/comprobante/${payment.id}`}>Ver comprobante</Link></td></tr>)}</tbody></table>{!payments.length && <div className="empty">Este socio todavía no tiene pagos registrados.</div>}</div></div></div>;
}
