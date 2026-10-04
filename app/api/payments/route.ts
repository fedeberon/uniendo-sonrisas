import { NextRequest } from "next/server";
import { demoPayments } from "@/lib/data";
import { getDb, hasDatabase } from "@/lib/db";

export async function GET() {
  if (!hasDatabase()) return Response.json({ payments: demoPayments, demo: true });
  const sql = getDb();
  const payments = await sql`SELECT payments.id, payments.member_id AS "memberId", payments.amount, payments.paid_at AS "paidAt", payments.period, COALESCE((SELECT ARRAY_AGG(payment_months.period_key ORDER BY payment_months.period_key) FROM payment_months WHERE payment_months.payment_id = payments.id), ARRAY[]::TEXT[]) AS "periodKeys", payments.status, payments.method, payments.months_count AS "monthsCount", payments.receipt_data AS "receiptData", payments.receipt_name AS "receiptName", payments.receipt_status AS "receiptStatus", payments.submitted_by AS "submittedBy" FROM payments ORDER BY payments.paid_at DESC`;
  return Response.json({ payments, demo: false });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const periodKeys = Array.isArray(body.periodKeys) ? body.periodKeys.filter((key: unknown): key is string => typeof key === "string" && key.length > 0) : [];
  if (!body.memberId || !body.amount || !body.period || !periodKeys.length) return Response.json({ error: "Socio y períodos son obligatorios" }, { status: 400 });
  if (body.receiptData && (typeof body.receiptData !== "string" || body.receiptData.length > 7_000_000)) return Response.json({ error: "El comprobante debe ser una imagen de hasta 5 MB" }, { status: 400 });
  if (!hasDatabase()) return Response.json({ payment: { id: `demo-${Date.now()}`, paidAt: "Hoy", status: "Pagado", receiptStatus: body.receiptData ? "Pendiente de revisión" : "Sin comprobante", ...body }, demo: true }, { status: 201 });
  const sql = getDb();
  const existing = await sql`SELECT period_key AS "periodKey" FROM payment_months WHERE member_id=${body.memberId} AND period_key = ANY(${periodKeys})`;
  if (existing.length) return Response.json({ error: "Uno o más períodos ya están pagados", paidPeriods: existing.map((row) => row.periodKey) }, { status: 409 });
  const id = `p-${crypto.randomUUID()}`;
  const receiptStatus = body.receiptData ? "Pendiente de revisión" : "Sin comprobante";
  const rows = await sql`INSERT INTO payments (id, member_id, amount, period, method, months_count, receipt_data, receipt_name, receipt_mime_type, receipt_status, submitted_by) VALUES (${id}, ${body.memberId}, ${body.amount}, ${body.period}, ${body.method || "Transferencia"}, ${body.monthsCount || 1}, ${body.receiptData || null}, ${body.receiptName || null}, ${body.receiptMimeType || null}, ${receiptStatus}, ${body.submittedBy || null}) RETURNING id, member_id AS "memberId", amount, paid_at AS "paidAt", period, status, method, months_count AS "monthsCount", receipt_name AS "receiptName", receipt_status AS "receiptStatus", submitted_by AS "submittedBy"`;
  for (const periodKey of periodKeys) await sql`INSERT INTO payment_months (id, payment_id, member_id, period_key) VALUES (${`pm-${crypto.randomUUID()}`}, ${id}, ${body.memberId}, ${periodKey})`;
  return Response.json({ payment: rows[0], demo: false }, { status: 201 });
}
