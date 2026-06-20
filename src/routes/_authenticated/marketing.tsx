import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/dashboard/AppShell";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Megaphone, TrendingUp, IndianRupee, Users } from "lucide-react";

export const Route = createFileRoute("/_authenticated/marketing")({
  head: () => ({ meta: [{ title: "Marketing · Harshil's Salon Suite" }] }),
  component: () => <AppShell><MarketingPage /></AppShell>,
});

const segments = [
  { name: "VIP tier", size: 84, growth: "+6%" },
  { name: "Active 30d", size: 412, growth: "+12%" },
  { name: "Inactive 90d+", size: 326, growth: "-4%" },
  { name: "Bridal interest", size: 58, growth: "+22%" },
  { name: "Men's grooming", size: 197, growth: "+9%" },
];

const conversions = Array.from({ length: 12 }, (_, i) => ({
  m: `M${i + 1}`,
  conv: 18 + Math.round(Math.sin(i / 2) * 8 + Math.random() * 6),
}));

function MarketingPage() {
  return (
    <>
      <PageHeader
        title="Marketing"
        subtitle="Campaigns, audience segments, and acquisition performance."
        actions={
          <Button style={{ background: "var(--gradient-primary)" }} className="text-primary-foreground border-0">
            <Megaphone className="size-4 mr-2" />New campaign
          </Button>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        {[
          { l: "Active campaigns", v: "7", i: Megaphone },
          { l: "Conversion rate", v: "24.6%", i: TrendingUp },
          { l: "Revenue generated", v: "₹3.42L", i: IndianRupee },
          { l: "Leads acquired", v: "186", i: Users },
        ].map((s) => {
          const Icon = s.i;
          return (
            <Card key={s.l}>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">{s.l}</div>
                  <div className="text-2xl font-semibold mt-1 tabular-nums">{s.v}</div>
                </div>
                <div className="size-10 rounded-lg bg-accent flex items-center justify-center text-primary"><Icon className="size-5" /></div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Conversion trend</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={conversions}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="m" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                  <Line type="monotone" dataKey="conv" stroke="var(--chart-1)" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Audience segments</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {segments.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-sm">
                <span className="font-medium">{s.name}</span>
                <div className="flex items-center gap-2">
                  <span className="tabular-nums">{s.size}</span>
                  <Badge variant="secondary" className="text-[10px]">{s.growth}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
