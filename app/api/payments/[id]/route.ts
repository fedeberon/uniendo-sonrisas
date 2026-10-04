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
  const rows = await sql`SELECT id, member_id AS "memberId", amount, paid_at AS "paidAt", period, status, method, months_count AS "monthsCount", receipt_data AS "receiptData", receipt_name AS "receiptName", receipt_status AS "receiptStatus", submitted_by AS "submittedBy" FROM payments WHERE id=${id}`;
  if (!rows[0]) return Response.json({ error: "Pago no encontrado" }, { status: 404 });
  return Response.json({ payment: { ...rows[0], paidAt: formatDate(rows[0].paidAt as string | Date) }, demo: false });
}
