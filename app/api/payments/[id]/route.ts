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
