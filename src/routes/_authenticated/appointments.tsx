import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/dashboard/AppShell";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Calendar as CalIcon } from "lucide-react";
import { mockAppointments } from "@/lib/mock-data";
import { useRealtimeSubscription } from "@/hooks/use-realtime";

export const Route = createFileRoute("/_authenticated/appointments")({
  head: () => ({ meta: [{ title: "Appointments · Harshil's Salon Suite" }] }),
  component: () => (
    <AppShell>
      <AppointmentsPage />
    </AppShell>
  ),
});

const tabs = ["All", "Today", "Upcoming", "Completed", "Cancelled"] as const;

function statusBadge(s: string) {
  const map: Record<string, string> = {
    confirmed: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    completed: "bg-sky-100 text-sky-700",
    "no-show": "bg-rose-100 text-rose-700",
    cancelled: "bg-muted text-muted-foreground",
  };
  return <Badge className={`${map[s]} border-0 capitalize`}>{s}</Badge>;
}

function AppointmentsPage() {
  useRealtimeSubscription("appointments");
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return mockAppointments.filter((a) => {
      if (tab === "Today" && a.date !== today) return false;
      if (tab === "Upcoming" && a.date < today) return false;
      if (tab === "Completed" && a.status !== "completed") return false;
      if (tab === "Cancelled" && a.status !== "cancelled" && a.status !== "no-show") return false;
      if (q && !`${a.client} ${a.service} ${a.staff}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [tab, q]);

  return (
    <>
      <PageHeader
        title="Appointments"
        subtitle="Live calendar — new bookings appear instantly."
        actions={
          <>
            <Button variant="outline"><CalIcon className="size-4 mr-2" />Calendar view</Button>
            <Button style={{ background: "var(--gradient-primary)" }} className="text-primary-foreground border-0">
              <Plus className="size-4 mr-2" /> New appointment
            </Button>
          </>
        }
      />
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
              <TabsList>
                {tabs.map((t) => <TabsTrigger key={t} value={t}>{t}</TabsTrigger>)}
              </TabsList>
            </Tabs>
            <div className="relative max-w-xs w-full">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search appointments" className="pl-9" />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="tabular-nums">{a.date}</TableCell>
                  <TableCell className="font-medium tabular-nums">{a.time}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-7"><AvatarFallback className="text-xs bg-accent">{a.client.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                      <div>
                        <div className="text-sm">{a.client}</div>
                        <div className="text-xs text-muted-foreground">{a.phone}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{a.service}</TableCell>
                  <TableCell>{a.staff}</TableCell>
                  <TableCell>{statusBadge(a.status)}</TableCell>
                  <TableCell className="text-right tabular-nums">₹{a.amount.toLocaleString("en-IN")}</TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-10">No appointments match your filter.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
