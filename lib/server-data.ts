import { demoMembers, demoPayments, type Member, type Payment } from "@/lib/data";
import { getDb, hasDatabase } from "@/lib/db";

type MemberRow = Omit<Member, "paidMonths" | "totalMonths"> & { joinedAt: string };

function mapMember(row: MemberRow): Member {
  return { ...row, phone: row.phone ?? "", avatar: row.avatar || row.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase(), paidMonths: 0, totalMonths: 12 };
}

export async function getMembers(): Promise<Member[]> {
  if (!hasDatabase()) return demoMembers;
  const sql = getDb();
  const rows = await sql`SELECT id, external_id AS "externalId", name, email, phone, address, joined_at AS "joinedAt", status, plan, avatar FROM members ORDER BY joined_at DESC, name ASC`;
  return rows.map((row) => mapMember(row as MemberRow));
}

export async function getPayments(): Promise<Payment[]> {
  if (!hasDatabase()) return demoPayments;
  const sql = getDb();
  return await sql`SELECT id, member_id AS "memberId", amount, paid_at AS "paidAt", period, status, method FROM payments ORDER BY paid_at DESC` as Payment[];
}

export async function getMember(id: string): Promise<Member | undefined> {
  const members = await getMembers();
  return members.find((member) => member.id === id);
}

export async function getMemberPayments(id: string): Promise<Payment[]> {
  const payments = await getPayments();
  return payments.filter((payment) => payment.memberId === id);
}
