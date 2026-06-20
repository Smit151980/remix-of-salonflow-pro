import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/dashboard/AppShell";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Download, FileSpreadsheet, FileText } from "lucide-react";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({ meta: [{ title: "Reports · Harshil's Salon Suite" }] }),
  component: () => <AppShell><ReportsPage /></AppShell>,
});

const revenue = Array.from({ length: 12 }, (_, i) => ({ m: `M${i + 1}`, rev: 180000 + Math.round(Math.sin(i / 2) * 40000 + Math.random() * 30000) }));
const appts = Array.from({ length: 12 }, (_, i) => ({ m: `M${i + 1}`, n: 240 + Math.round(Math.sin(i / 3) * 60 + Math.random() * 40) }));

function ReportsPage() {
  const [range, setRange] = useState("month");

  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Business intelligence across revenue, clients, inventory, and WhatsApp."
        actions={
          <>
            <Button variant="outline"><FileSpreadsheet className="size-4 mr-2" />Excel</Button>
            <Button variant="outline"><FileText className="size-4 mr-2" />PDF</Button>
            <Button><Download className="size-4 mr-2" />CSV</Button>
          </>
        }
      />
      <Tabs value={range} onValueChange={setRange} className="mb-6">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This week</TabsTrigger>
          <TabsTrigger value="month">This month</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 lg:grid-cols-2 mb-6">
        <Card>
          <CardHeader><CardTitle>Revenue trend</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenue}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="m" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                  <Line type="monotone" dataKey="rev" stroke="var(--chart-1)" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Appointments per month</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={appts}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="m" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="n" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: "Client growth", v: "+18%", s: "vs prev period" },
          { l: "Avg ticket size", v: "₹2,140", s: "+₹120" },
          { l: "Inventory turn", v: "3.4x", s: "healthy" },
          { l: "WA delivery rate", v: "94.4%", s: "stable" },
        ].map((k) => (
          <Card key={k.l}>
            <CardContent className="p-5">
              <div className="text-sm text-muted-foreground">{k.l}</div>
              <div className="text-2xl font-semibold mt-1 tabular-nums">{k.v}</div>
              <div className="text-xs text-muted-foreground mt-1">{k.s}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
