import { demoMembers, demoPayments, type Member, type Payment } from "@/lib/data";
import { getDb, hasDatabase } from "@/lib/db";

type MemberRow = Omit<Member, "paidMonths" | "totalMonths"> & { joinedAt: string };

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(value);
}

function mapMember(row: MemberRow): Member {
  return { ...row, joinedAt: formatDate(row.joinedAt), phone: row.phone ?? "", avatar: row.avatar || row.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase(), paidMonths: 0, totalMonths: 12 };
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
  const rows = await sql`SELECT payments.id, payments.member_id AS "memberId", payments.amount, payments.paid_at AS "paidAt", payments.period, COALESCE((SELECT ARRAY_AGG(payment_months.period_key ORDER BY payment_months.period_key) FROM payment_months WHERE payment_months.payment_id = payments.id), ARRAY[]::TEXT[]) AS "periodKeys", payments.status, payments.method, payments.months_count AS "monthsCount", payments.receipt_data AS "receiptData", payments.receipt_name AS "receiptName", payments.receipt_status AS "receiptStatus", payments.submitted_by AS "submittedBy" FROM payments ORDER BY payments.paid_at DESC`;
  return rows.map((row) => ({ ...row, paidAt: formatDate(row.paidAt as string | Date) })) as Payment[];
}

export async function getMember(id: string): Promise<Member | undefined> {
  const members = await getMembers();
  return members.find((member) => member.id === id);
}

export async function getMemberPayments(id: string): Promise<Payment[]> {
  const payments = await getPayments();
  return payments.filter((payment) => payment.memberId === id);
}
