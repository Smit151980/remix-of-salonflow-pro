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
import { Plus, Search, Crown, UserPlus, Cake } from "lucide-react";
import { mockClients } from "@/lib/mock-data";
import { useRealtimeSubscription } from "@/hooks/use-realtime";

export const Route = createFileRoute("/_authenticated/clients")({
  head: () => ({ meta: [{ title: "Clients · Harshil's Salon Suite" }] }),
  component: () => <AppShell><ClientsPage /></AppShell>,
});

const tierColor: Record<string, string> = {
  VIP: "bg-amber-100 text-amber-800",
  Active: "bg-emerald-100 text-emerald-700",
  New: "bg-sky-100 text-sky-700",
  Inactive: "bg-muted text-muted-foreground",
};

function ClientsPage() {
  useRealtimeSubscription("clients");
  const [q, setQ] = useState("");
  const rows = useMemo(
    () => mockClients.filter((c) => `${c.name} ${c.phone} ${c.email}`.toLowerCase().includes(q.toLowerCase())),
    [q],
  );
  const stats = [
    { label: "Total clients", value: mockClients.length, icon: UserPlus },
    { label: "VIP", value: mockClients.filter((c) => c.tier === "VIP").length, icon: Crown },
    { label: "Birthdays this month", value: mockClients.filter((c) => new Date(c.dob).getMonth() === new Date().getMonth()).length, icon: Cake },
  ];

  return (
    <>
      <PageHeader
        title="Clients"
        subtitle="Customer intelligence — lifecycle, spend, and reach in one place."
        actions={
          <Button style={{ background: "var(--gradient-primary)" }} className="text-primary-foreground border-0">
            <Plus className="size-4 mr-2" /> Add client
          </Button>
        }
      />
      <div className="grid gap-3 sm:grid-cols-3 mb-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                  <div className="text-2xl font-semibold mt-1 tabular-nums">{s.value}</div>
                </div>
                <div className="size-10 rounded-lg bg-accent flex items-center justify-center text-primary"><Icon className="size-5" /></div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="relative max-w-xs">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search clients" className="pl-9" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead className="text-right">Visits</TableHead>
                <TableHead className="text-right">Lifetime spend</TableHead>
                <TableHead>Last visit</TableHead>
                <TableHead>Birthday</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-8"><AvatarFallback className="text-xs bg-accent">{c.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                      <div>
                        <div className="text-sm">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.phone}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge className={`${tierColor[c.tier]} border-0`}>{c.tier}</Badge></TableCell>
                  <TableCell className="text-right tabular-nums">{c.visits}</TableCell>
                  <TableCell className="text-right tabular-nums">₹{c.spend.toLocaleString("en-IN")}</TableCell>
                  <TableCell>{c.lastVisit}</TableCell>
                  <TableCell>{c.dob.slice(5)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
