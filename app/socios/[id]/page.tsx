import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { MemberDetail } from "@/components/member-detail";
import { money } from "@/lib/data";
import { getMember, getMemberPayments } from "@/lib/server-data";

export default async function MemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await getMember(id);
  if (!member) notFound();
  const payments = await getMemberPayments(id);

  return <Shell current="Socios"><div className="content"><Link className="back" href="/socios">← Volver a socios</Link><MemberDetail member={member} payments={payments}/><div className="detail-grid"><div className="card"><div className="card-head"><div className="card-title">Información del socio</div><span className={`status ${member.status === "Activo" ? "status-active" : member.status === "Pendiente" ? "status-pending" : "status-inactive"}`}>{member.status}</span></div><div className="info-list"><div><div className="info-label">Email</div><div className="info-value">{member.email || "Pendiente de completar"}</div></div><div><div className="info-label">Teléfono</div><div className="info-value">{member.phone || "Pendiente de completar"}</div></div><div><div className="info-label">Domicilio</div><div className="info-value">{member.address || "Pendiente de completar"}</div></div><div><div className="info-label">Fecha de alta</div><div className="info-value">{member.joinedAt}</div></div><div><div className="info-label">Plan</div><div className="info-value">{member.plan}</div></div></div></div><div className="card"><div className="card-head"><div className="card-title">Historial de pagos</div><Link className="link" href={`/socios/${member.id}/pagos`}>{payments.length} pagos registrados</Link></div><table className="table"><thead><tr><th>Período</th><th>Fecha</th><th>Método</th><th>Importe</th></tr></thead><tbody>{payments.length ? payments.map((payment) => <tr key={payment.id}><td>{payment.period}</td><td>{payment.paidAt}</td><td>{payment.method}</td><td>{money(payment.amount)}</td></tr>) : <tr><td colSpan={4}><div className="empty">Todavía no hay pagos registrados.</div></td></tr>}</tbody></table></div></div></div></Shell>;
}
