import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { MemberPaymentReport } from "@/components/member-payment-report";
import { getMember, getMemberPayments } from "@/lib/server-data";

export default async function MemberPaymentsReport({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const member = await getMember(id); if (!member) notFound();
  const payments = await getMemberPayments(id);
  return <Shell current="Socios"><MemberPaymentReport member={member} payments={payments}/></Shell>;
}
