import { NextRequest } from "next/server";
import { demoMembers } from "@/lib/data";
import { getDb, hasDatabase } from "@/lib/db";

export async function GET() {
  if (!hasDatabase()) return Response.json({ members: demoMembers, demo: true });
  const sql = getDb();
  const members = await sql`SELECT id, name, email, phone, joined_at AS "joinedAt", status, plan, avatar FROM members ORDER BY joined_at DESC`;
  return Response.json({ members, demo: false });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.name || !body.email) return Response.json({ error: "Nombre y email son obligatorios" }, { status: 400 });
  if (!hasDatabase()) return Response.json({ member: { id: `demo-${Date.now()}`, ...body }, demo: true }, { status: 201 });
  const sql = getDb();
  const id = `m-${crypto.randomUUID()}`;
  const rows = await sql`INSERT INTO members (id, name, email, phone, plan, avatar) VALUES (${id}, ${body.name}, ${body.email}, ${body.phone || ""}, ${body.plan || "Socio colaborador"}, ${body.avatar || ""}) RETURNING *`;
  return Response.json({ member: rows[0], demo: false }, { status: 201 });
}
