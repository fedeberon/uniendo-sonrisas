"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { money, type Member, type Payment } from "@/lib/data";

const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const prices = [18500, 18500, 19500, 19500, 19500, 21000, 21000, 21000, 22500, 22500, 22500, 22500];

function periodKey(year: number, month: number) { return `${year}-${String(month + 1).padStart(2, "0")}`; }

export function MemberDetail({ member, payments }: { member: Member; payments: Payment[] }) {
  const [annualOpen, setAnnualOpen] = useState(false);
  const [year, setYear] = useState(2026);
  const [selectedDebt, setSelectedDebt] = useState<string[]>([]);
  const paidKeys = useMemo(() => new Set(payments.flatMap((payment) => payment.periodKeys || [])), [payments]);
  const yearMonths = months.map((label, index) => ({ label, amount: prices[index], key: periodKey(year, index), paid: paidKeys.has(periodKey(year, index)) }));
  const paidCount = yearMonths.filter((month) => month.paid).length;
  const debtCount = yearMonths.length - paidCount;
  const debtAmount = yearMonths.filter((month) => !month.paid).reduce((total, month) => total + month.amount, 0);
  const selectedDebtAmount = yearMonths.filter((month) => selectedDebt.includes(month.key)).reduce((total, month) => total + month.amount, 0);
  const toggleDebt = (key: string, paid: boolean) => { if (paid) return; setSelectedDebt((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]); };
  const openAnnual = () => { setSelectedDebt([]); setAnnualOpen(true); };

  return <>
    <div className="profile-head">
      <div className="profile-person"><div className="profile-avatar">{member.avatar}</div><div><div className="profile-name">{member.name}</div><div className="profile-mail">{member.email || "Email pendiente"} · {member.phone || member.address || "Sin contacto cargado"}</div></div></div>
      <div className="profile-actions"><button className="secondary">Editar datos</button><Link className="primary" href={`/pagos?memberId=${encodeURIComponent(member.id)}`}>Registrar pago</Link></div>
    </div>
    <div className="member-payment-summary">
      <div><span className="summary-label">Estado de deuda {year}</span><strong className={debtCount ? "summary-debt" : "summary-paid"}>{debtCount ? `${debtCount} meses pendientes` : "Al día"}</strong><small>{debtCount ? `${money(debtAmount)} estimados` : "Todos los períodos registrados"}</small></div>
      <button className="secondary" onClick={openAnnual}>Ver pagos por año</button>
    </div>
    {annualOpen && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setAnnualOpen(false); }}><section className="modal card annual-modal" role="dialog" aria-modal="true" aria-labelledby="annual-title"><div className="card-head"><div><div className="card-title" id="annual-title">Estado de pagos</div><p className="modal-subtitle">{member.name}: seleccioná meses vencidos para cobrarlos.</p></div><button type="button" className="close" onClick={() => setAnnualOpen(false)}>×</button></div><div className="annual-toolbar"><button type="button" className="secondary" onClick={() => { setYear((value) => value - 1); setSelectedDebt([]); }}>←</button><strong>{year}</strong><button type="button" className="secondary" onClick={() => { setYear((value) => value + 1); setSelectedDebt([]); }}>→</button></div><div className="annual-counters"><div><strong>{paidCount}</strong><span>Pagados</span></div><div><strong className="summary-debt">{debtCount}</strong><span>Pendientes</span></div><div><strong>{money(debtAmount)}</strong><span>Deuda estimada</span></div></div><div className="annual-month-grid">{yearMonths.map((month) => <button type="button" className={`annual-month ${month.paid ? "is-paid" : "is-pending"} ${selectedDebt.includes(month.key) ? "is-selected" : ""}`} key={month.key} disabled={month.paid} onClick={() => toggleDebt(month.key, month.paid)}><div><strong>{month.label}</strong><small>{month.paid ? "Pago registrado" : selectedDebt.includes(month.key) ? "Seleccionado para cobrar" : "Pendiente · seleccionar"}</small></div><b>{money(month.amount)}</b></button>)}</div><div className="annual-selection"><span>{selectedDebt.length ? `${selectedDebt.length} mes${selectedDebt.length === 1 ? "" : "es"} seleccionados` : "Seleccioná los meses que querés cobrar"}</span><strong>{money(selectedDebtAmount)}</strong></div><div className="modal-actions"><button type="button" className="secondary" onClick={() => setAnnualOpen(false)}>Cerrar</button><Link className="secondary" href={`/socios/${member.id}/pagos`}>Ver historial completo</Link><Link className={`primary ${!selectedDebt.length ? "disabled-link" : ""}`} aria-disabled={!selectedDebt.length} onClick={(event) => { if (!selectedDebt.length) event.preventDefault(); }} href={`/pagos?memberId=${encodeURIComponent(member.id)}&periods=${encodeURIComponent(selectedDebt.join(","))}`}>Cobrar seleccionados</Link></div></section></div>}
  </>;
}
