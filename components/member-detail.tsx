"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { money, type Member, type Payment } from "@/lib/data";

const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const prices = [18500, 18500, 19500, 19500, 19500, 21000, 21000, 21000, 22500, 22500, 22500, 22500];

function periodKey(year: number, month: number) { return `${year}-${String(month + 1).padStart(2, "0")}`; }

export function MemberDetail({ member, payments }: { member: Member; payments: Payment[] }) {
  const router = useRouter();
  const [annualOpen, setAnnualOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: member.name, email: member.email || "", phone: member.phone || "", address: member.address || "", plan: member.plan, status: member.status });
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
  const openEdit = () => { setError(""); setForm({ name: member.name, email: member.email || "", phone: member.phone || "", address: member.address || "", plan: member.plan, status: member.status }); setEditOpen(true); };
  const saveEdit = async (event: React.FormEvent) => { event.preventDefault(); setSaving(true); setError(""); try { const response = await fetch(`/api/members/${member.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); const data = await response.json(); if (!response.ok || !data.member) throw new Error(data.error || "No se pudieron guardar los datos."); setEditOpen(false); router.refresh(); } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudieron guardar los datos."); } finally { setSaving(false); } };

  return <>
    <div className="profile-head">
      <div className="profile-person"><div className="profile-avatar">{member.avatar}</div><div><div className="profile-name">{member.name}</div><div className="profile-mail">{member.email || "Email pendiente"} · {member.phone || member.address || "Sin contacto cargado"}</div></div></div>
      <div className="profile-actions"><button type="button" className="secondary" onClick={openEdit}>Editar datos</button><Link className="primary" href={`/pagos?memberId=${encodeURIComponent(member.id)}`}>Registrar pago</Link></div>
    </div>
    <div className="member-payment-summary">
      <div><span className="summary-label">Estado de deuda {year}</span><strong className={debtCount ? "summary-debt" : "summary-paid"}>{debtCount ? `${debtCount} meses pendientes` : "Al día"}</strong><small>{debtCount ? `${money(debtAmount)} estimados` : "Todos los períodos registrados"}</small></div>
      <button className="secondary" onClick={openAnnual}>Ver pagos por año</button>
    </div>
    {annualOpen && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setAnnualOpen(false); }}><section className="modal card annual-modal" role="dialog" aria-modal="true" aria-labelledby="annual-title"><div className="card-head"><div><div className="card-title" id="annual-title">Estado de pagos</div><p className="modal-subtitle">{member.name}: seleccioná meses vencidos para cobrarlos.</p></div><button type="button" className="close" onClick={() => setAnnualOpen(false)}>×</button></div><div className="annual-toolbar"><button type="button" className="secondary" onClick={() => { setYear((value) => value - 1); setSelectedDebt([]); }}>←</button><strong>{year}</strong><button type="button" className="secondary" onClick={() => { setYear((value) => value + 1); setSelectedDebt([]); }}>→</button></div><div className="annual-counters"><div><strong>{paidCount}</strong><span>Pagados</span></div><div><strong className="summary-debt">{debtCount}</strong><span>Pendientes</span></div><div><strong>{money(debtAmount)}</strong><span>Deuda estimada</span></div></div><div className="annual-month-grid">{yearMonths.map((month) => <button type="button" className={`annual-month ${month.paid ? "is-paid" : "is-pending"} ${selectedDebt.includes(month.key) ? "is-selected" : ""}`} key={month.key} disabled={month.paid} onClick={() => toggleDebt(month.key, month.paid)}><div><strong>{month.label}</strong><small>{month.paid ? "Pago registrado" : selectedDebt.includes(month.key) ? "Seleccionado para cobrar" : "Pendiente · seleccionar"}</small></div><b>{money(month.amount)}</b></button>)}</div><div className="annual-selection"><span>{selectedDebt.length ? `${selectedDebt.length} mes${selectedDebt.length === 1 ? "" : "es"} seleccionados` : "Seleccioná los meses que querés cobrar"}</span><strong>{money(selectedDebtAmount)}</strong></div><div className="modal-actions"><button type="button" className="secondary" onClick={() => setAnnualOpen(false)}>Cerrar</button><Link className="secondary" href={`/socios/${member.id}/pagos`}>Ver historial completo</Link><Link className={`primary ${!selectedDebt.length ? "disabled-link" : ""}`} aria-disabled={!selectedDebt.length} onClick={(event) => { if (!selectedDebt.length) event.preventDefault(); }} href={`/pagos?memberId=${encodeURIComponent(member.id)}&periods=${encodeURIComponent(selectedDebt.join(","))}`}>Cobrar seleccionados</Link></div></section></div>}
    {editOpen && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) setEditOpen(false); }}><form className="modal card member-edit-modal" onSubmit={saveEdit}><div className="card-head"><div><div className="card-title">Editar datos del socio</div><p className="modal-subtitle">Actualizá la información de contacto y afiliación.</p></div><button type="button" className="close" disabled={saving} onClick={() => setEditOpen(false)}>×</button></div><label>Nombre completo<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })}/></label><label>Email<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })}/></label><label>Teléfono<input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })}/></label><label>Domicilio<input value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="Ej. Alsina 165"/></label><label>Plan<select value={form.plan} onChange={(event) => setForm({ ...form, plan: event.target.value })}><option>Socio colaborador</option><option>Socio fundador</option><option>Socio benefactor</option></select></label><label>Estado<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as Member["status"] })}><option>Activo</option><option>Pendiente</option><option>Inactivo</option></select></label>{error && <div className="login-error">{error}</div>}<div className="modal-actions"><button type="button" className="secondary" disabled={saving} onClick={() => setEditOpen(false)}>Cancelar</button><button className="primary" disabled={saving}>{saving ? "Guardando…" : "Guardar cambios"}</button></div></form></div>}
  </>;
}
