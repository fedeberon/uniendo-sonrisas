import { NextRequest } from "next/server";
import { demoPayments } from "@/lib/data";
import { getDb, hasDatabase } from "@/lib/db";

export async function GET() {
  if (!hasDatabase()) return Response.json({ payments: demoPayments, demo: true });
  const sql = getDb();
  const payments = await sql`SELECT id, member_id AS "memberId", amount, paid_at AS "paidAt", period, status, method, months_count AS "monthsCount", receipt_data AS "receiptData", receipt_name AS "receiptName", receipt_status AS "receiptStatus", submitted_by AS "submittedBy" FROM payments ORDER BY paid_at DESC`;
  return Response.json({ payments, demo: false });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.memberId || !body.amount || !body.period || !body.receiptData) return Response.json({ error: "Socio, importe, período y comprobante son obligatorios" }, { status: 400 });
  if (typeof body.receiptData !== "string" || body.receiptData.length > 7_000_000) return Response.json({ error: "El comprobante debe ser una imagen de hasta 5 MB" }, { status: 400 });
  if (!hasDatabase()) return Response.json({ payment: { id: `demo-${Date.now()}`, paidAt: "Hoy", status: "Pagado", receiptStatus: "Pendiente de revisión", ...body }, demo: true }, { status: 201 });
  const sql = getDb();
  const id = `p-${crypto.randomUUID()}`;
  const rows = await sql`INSERT INTO payments (id, member_id, amount, period, method, months_count, receipt_data, receipt_name, receipt_mime_type, receipt_status, submitted_by) VALUES (${id}, ${body.memberId}, ${body.amount}, ${body.period}, ${body.method || "Transferencia"}, ${body.monthsCount || 1}, ${body.receiptData}, ${body.receiptName || "comprobante"}, ${body.receiptMimeType || "image/*"}, 'Pendiente de revisión', ${body.submittedBy || null}) RETURNING id, member_id AS "memberId", amount, paid_at AS "paidAt", period, status, method, months_count AS "monthsCount", receipt_name AS "receiptName", receipt_status AS "receiptStatus", submitted_by AS "submittedBy"`;
  return Response.json({ payment: rows[0], demo: false }, { status: 201 });
}
