import { NextRequest } from "next/server";
import { demoMembers } from "@/lib/data";
import { getDb, hasDatabase } from "@/lib/db";
import { formatDate } from "@/lib/server-data";

export async function GET() {
  if (!hasDatabase()) return Response.json({ members: demoMembers, demo: true });
  const sql = getDb();
  const rows = await sql`SELECT id, external_id AS "externalId", name, email, phone, address, joined_at AS "joinedAt", status, plan, avatar FROM members ORDER BY joined_at DESC, name ASC`;
  const members = rows.map((member) => ({ ...member, joinedAt: formatDate(member.joinedAt as string | Date) }));
  return Response.json({ members, demo: false });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.name) return Response.json({ error: "El nombre es obligatorio" }, { status: 400 });
  if (!hasDatabase()) return Response.json({ member: { id: `demo-${Date.now()}`, joinedAt: "Hoy", status: "Activo", paidMonths: 0, totalMonths: 12, ...body }, demo: true }, { status: 201 });
  const sql = getDb();
  const id = `m-${crypto.randomUUID()}`;
  const rows = await sql`INSERT INTO members (id, name, email, phone, address, plan, avatar) VALUES (${id}, ${body.name}, ${body.email || null}, ${body.phone || ""}, ${body.address || ""}, ${body.plan || "Socio colaborador"}, ${body.avatar || ""}) RETURNING *`;
  return Response.json({ member: rows[0], demo: false }, { status: 201 });
}
