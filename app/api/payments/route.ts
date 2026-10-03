import { NextRequest } from "next/server";
import { demoPayments } from "@/lib/data";
import { getDb, hasDatabase } from "@/lib/db";

export async function GET() {
  if (!hasDatabase()) return Response.json({ payments: demoPayments, demo: true });
  const sql = getDb();
  const payments = await sql`SELECT id, member_id AS "memberId", amount, paid_at AS "paidAt", period, status, method FROM payments ORDER BY paid_at DESC`;
  return Response.json({ payments, demo: false });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.memberId || !body.amount || !body.period) return Response.json({ error: "Socio, importe y período son obligatorios" }, { status: 400 });
  if (!hasDatabase()) return Response.json({ payment: { id: `demo-${Date.now()}`, ...body }, demo: true }, { status: 201 });
  const sql = getDb();
  const id = `p-${crypto.randomUUID()}`;
  const rows = await sql`INSERT INTO payments (id, member_id, amount, period, method) VALUES (${id}, ${body.memberId}, ${body.amount}, ${body.period}, ${body.method || "Transferencia"}) RETURNING *`;
  return Response.json({ payment: rows[0], demo: false }, { status: 201 });
}
