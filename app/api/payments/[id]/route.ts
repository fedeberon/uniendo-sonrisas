import { NextRequest } from "next/server";
import { getDb, hasDatabase } from "@/lib/db";
import { demoPayments } from "@/lib/data";
import { formatDate } from "@/lib/server-data";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!hasDatabase()) {
    const payment = demoPayments.find((item) => item.id === id);
    return payment ? Response.json({ payment: { ...payment, paidAt: formatDate(payment.paidAt) }, demo: true }) : Response.json({ error: "Pago no encontrado" }, { status: 404 });
  }
  const sql = getDb();
  const rows = await sql`SELECT payments.id, payments.member_id AS "memberId", payments.amount, payments.paid_at AS "paidAt", payments.period, COALESCE((SELECT ARRAY_AGG(payment_months.period_key ORDER BY payment_months.period_key) FROM payment_months WHERE payment_months.payment_id = payments.id), ARRAY[]::TEXT[]) AS "periodKeys", payments.status, payments.method, payments.months_count AS "monthsCount", payments.receipt_data AS "receiptData", payments.receipt_name AS "receiptName", payments.receipt_status AS "receiptStatus", payments.submitted_by AS "submittedBy" FROM payments WHERE payments.id=${id}`;
  if (!rows[0]) return Response.json({ error: "Pago no encontrado" }, { status: 404 });
  return Response.json({ payment: { ...rows[0], paidAt: formatDate(rows[0].paidAt as string | Date) }, demo: false });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  if (!["Aprobado", "Rechazado", "Sin comprobante"].includes(body.receiptStatus)) return Response.json({ error: "Estado de comprobante inválido" }, { status: 400 });
  if (!hasDatabase()) return Response.json({ payment: { id, receiptStatus: body.receiptStatus, status: body.receiptStatus === "Aprobado" ? "Pagado" : "Pendiente" }, demo: true });
  const sql = getDb();
  const status = body.receiptStatus === "Aprobado" ? "Pagado" : body.receiptStatus === "Rechazado" ? "Rechazado" : "Pagado";
  const rows = await sql`UPDATE payments SET receipt_status=${body.receiptStatus}, status=${status} WHERE id=${id} RETURNING id, member_id AS "memberId", amount, paid_at AS "paidAt", period, status, method, months_count AS "monthsCount", receipt_name AS "receiptName", receipt_status AS "receiptStatus", submitted_by AS "submittedBy"`;
  if (!rows[0]) return Response.json({ error: "Pago no encontrado" }, { status: 404 });
  return Response.json({ payment: rows[0], demo: false });
}
