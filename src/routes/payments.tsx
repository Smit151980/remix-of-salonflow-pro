import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/dashboard/AppShell";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Plus } from "lucide-react";
import { mockPayments } from "@/lib/mock-data";
import { useRealtimeSubscription } from "@/hooks/use-realtime";

export const Route = createFileRoute("/payments")({
  head: () => ({ meta: [{ title: "Payments · Harshil's Salon Suite" }] }),
  component: () => <AppShell><PaymentsPage /></AppShell>,
});

const statusColor: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  refunded: "bg-sky-100 text-sky-700",
  failed: "bg-rose-100 text-rose-700",
};

function PaymentsPage() {
  useRealtimeSubscription("payments");
  const totals = mockPayments.reduce(
    (a, p) => {
      if (p.status === "paid") a.paid += p.amount;
      if (p.status === "pending") a.pending += p.amount;
      if (p.status === "refunded") a.refunded += p.amount;
      return a;
    },
    { paid: 0, pending: 0, refunded: 0 },
  );

  return (
    <>
      <PageHeader
        title="Payments"
        subtitle="Invoices, refunds, and payment methods at a glance."
        actions={
          <>
            <Button variant="outline"><Download className="size-4 mr-2" />Export</Button>
            <Button style={{ background: "var(--gradient-primary)" }} className="text-primary-foreground border-0">
              <Plus className="size-4 mr-2" /> New invoice
            </Button>
          </>
        }
      />
      <div className="grid gap-3 sm:grid-cols-3 mb-6">
        {[
          { l: "Paid this month", v: totals.paid, c: "text-emerald-600" },
          { l: "Pending", v: totals.pending, c: "text-amber-600" },
          { l: "Refunded", v: totals.refunded, c: "text-sky-600" },
        ].map((s) => (
          <Card key={s.l}>
            <CardContent className="p-5">
              <div className="text-sm text-muted-foreground">{s.l}</div>
              <div className={`text-2xl font-semibold mt-1 tabular-nums ${s.c}`}>₹{s.v.toLocaleString("en-IN")}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPayments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.invoice}</TableCell>
                  <TableCell>{p.client}</TableCell>
                  <TableCell>{p.mode}</TableCell>
                  <TableCell>{p.date}</TableCell>
                  <TableCell><Badge className={`${statusColor[p.status]} border-0 capitalize`}>{p.status}</Badge></TableCell>
                  <TableCell className="text-right tabular-nums">₹{p.amount.toLocaleString("en-IN")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
