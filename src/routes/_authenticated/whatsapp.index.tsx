import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/dashboard/AppShell";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MessageCircle, Send, CheckCheck, Eye, XCircle, FileText, Zap } from "lucide-react";
import { mockWhatsAppAnalytics, mockCampaigns } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/whatsapp/")({
  head: () => ({ meta: [{ title: "WhatsApp · Harshil's Salon Suite" }] }),
  component: () => <AppShell><WhatsAppHome /></AppShell>,
});

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

function WhatsAppHome() {
  const a = mockWhatsAppAnalytics;
  const cards = [
    { l: "Messages sent", v: a.sent.toLocaleString("en-IN"), i: Send, c: "text-sky-600" },
    { l: "Delivered", v: a.delivered.toLocaleString("en-IN"), i: CheckCheck, c: "text-emerald-600" },
    { l: "Read", v: a.read.toLocaleString("en-IN"), i: Eye, c: "text-violet-600" },
    { l: "Failed", v: a.failed.toLocaleString("en-IN"), i: XCircle, c: "text-rose-600" },
  ];
  const pie = [
    { name: "Delivered", value: a.delivered },
    { name: "Read", value: a.read },
    { name: "Failed", value: a.failed },
  ];

  return (
    <>
      <PageHeader
        title="WhatsApp"
        subtitle="Templates, campaigns, automations, and message logs in one inbox."
        actions={
          <>
            <Button asChild variant="outline"><Link to="/whatsapp/templates"><FileText className="size-4 mr-2" />Templates</Link></Button>
            <Button asChild style={{ background: "var(--gradient-primary)" }} className="text-primary-foreground border-0">
              <Link to="/whatsapp/campaigns"><Send className="size-4 mr-2" />New campaign</Link>
            </Button>
          </>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        {cards.map((c) => {
          const Icon = c.i;
          return (
            <Card key={c.l}>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">{c.l}</div>
                  <div className={`text-2xl font-semibold mt-1 tabular-nums ${c.c}`}>{c.v}</div>
                </div>
                <div className="size-10 rounded-lg bg-accent flex items-center justify-center text-primary"><Icon className="size-5" /></div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Message volume — last 14 days</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={a.daily}>
                  <defs>
                    <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="d" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                  <Area type="monotone" dataKey="sent" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#g1)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Delivery breakdown</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pie} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                    {pie.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 space-y-1.5 text-sm">
              {pie.map((p, i) => (
                <li key={p.name} className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="flex-1 text-muted-foreground">{p.name}</span>
                  <span className="font-medium tabular-nums">{p.value.toLocaleString("en-IN")}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Recent campaigns</CardTitle>
          <Button asChild size="sm" variant="ghost"><Link to="/whatsapp/campaigns">View all</Link></Button>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockCampaigns.map(c => ({ name: c.name, sent: c.sent, delivered: c.delivered }))}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="sent" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="delivered" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3 mt-6">
        {[
          { t: "Templates", d: "Approved message templates", to: "/whatsapp/templates", i: FileText },
          { t: "Campaigns", d: "Bulk sends & schedules", to: "/whatsapp/campaigns", i: Send },
          { t: "Automation", d: "Trigger → condition → action", to: "/whatsapp/automation", i: Zap },
        ].map((c) => {
          const Icon = c.i;
          return (
            <Card key={c.t}>
              <CardContent className="p-5 flex items-center gap-3">
                <div className="size-10 rounded-lg bg-accent flex items-center justify-center text-primary"><Icon className="size-5" /></div>
                <div className="flex-1">
                  <div className="font-medium">{c.t}</div>
                  <div className="text-xs text-muted-foreground">{c.d}</div>
                </div>
                <Button asChild size="sm" variant="ghost"><Link to={c.to}>Open</Link></Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="text-xs text-muted-foreground mt-6 inline-flex items-center gap-2">
        <MessageCircle className="size-3.5" /> Meta Cloud API integration is configured via Settings → WhatsApp API.
      </div>
    </>
  );
}
