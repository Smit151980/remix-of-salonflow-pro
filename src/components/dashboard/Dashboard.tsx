import { useRealtimeSubscription } from "@/hooks/use-realtime";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getDashboardStats, getCurrentUser } from "@/lib/dashboard.functions";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarCheck2,
  IndianRupee,
  Repeat,
  Users,
  Plus,
  MessageCircle,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

const revenueSeries = [
  { d: "Mon", revenue: 18400, appts: 14 },
  { d: "Tue", revenue: 22100, appts: 17 },
  { d: "Wed", revenue: 19850, appts: 15 },
  { d: "Thu", revenue: 27400, appts: 21 },
  { d: "Fri", revenue: 34800, appts: 28 },
  { d: "Sat", revenue: 41200, appts: 33 },
  { d: "Sun", revenue: 29600, appts: 24 },
];

const serviceMix = [
  { name: "Hair", value: 42 },
  { name: "Spa", value: 23 },
  { name: "Nails", value: 18 },
  { name: "Skin", value: 11 },
  { name: "Bridal", value: 6 },
];

const staffPerf = [
  { name: "Aisha", bookings: 38, rating: 4.9 },
  { name: "Rohan", bookings: 32, rating: 4.8 },
  { name: "Meera", bookings: 29, rating: 4.7 },
  { name: "Karan", bookings: 24, rating: 4.6 },
  { name: "Diya", bookings: 21, rating: 4.8 },
];

const upcoming = [
  { time: "10:30", client: "Priya Sharma", service: "Hair Color + Cut", staff: "Aisha", status: "confirmed", amount: 3200 },
  { time: "11:15", client: "Nikhil Verma", service: "Beard Styling", staff: "Rohan", status: "confirmed", amount: 600 },
  { time: "12:00", client: "Ananya Iyer", service: "Bridal Trial", staff: "Meera", status: "pending", amount: 8500 },
  { time: "13:30", client: "Kabir Singh", service: "Deep Tissue Massage", staff: "Karan", status: "confirmed", amount: 2400 },
  { time: "15:00", client: "Sara Khan", service: "Gel Manicure", staff: "Diya", status: "no-show", amount: 1200 },
  { time: "16:15", client: "Riya Mehta", service: "Keratin Treatment", staff: "Aisha", status: "confirmed", amount: 6800 },
];

const messages = [
  { name: "Priya Sharma", text: "Can I reschedule to 4 PM?", time: "2m", unread: true },
  { name: "Ananya Iyer", text: "Yes, confirmed for trial 🙌", time: "18m", unread: true },
  { name: "Kabir Singh", text: "Thanks, see you soon.", time: "1h", unread: false },
  { name: "Riya Mehta", text: "Do you have aftercare oil?", time: "3h", unread: true },
];

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function statusBadge(s: string) {
  if (s === "confirmed")
    return (
      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">
        <CheckCircle2 className="size-3 mr-1" /> Confirmed
      </Badge>
    );
  if (s === "pending")
    return (
      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0">
        <Clock className="size-3 mr-1" /> Pending
      </Badge>
    );
  return (
    <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-0">
      <XCircle className="size-3 mr-1" /> No-show
    </Badge>
  );
}

export function Dashboard() {
  useRealtimeSubscription("appointments");
  useRealtimeSubscription("payments");
  useRealtimeSubscription("whatsapp_campaigns");
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Good morning, Harshil</h1>
          <p className="text-sm text-muted-foreground">
            Here's how Harshil's Salon is doing today — Saturday, 20 Jun 2026.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <MessageCircle className="size-4 mr-2" /> Broadcast WhatsApp
          </Button>
          <Button style={{ background: "var(--gradient-primary)" }} className="text-primary-foreground border-0">
            <Plus className="size-4 mr-2" /> New appointment
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{k.label}</span>
                  <div className="size-9 rounded-lg bg-accent flex items-center justify-center text-primary">
                    <Icon className="size-4" />
                  </div>
                </div>
                <div className="mt-3 text-2xl font-semibold tracking-tight">{k.value}</div>
                <div className={`mt-1 inline-flex items-center text-xs ${k.up ? "text-emerald-600" : "text-rose-600"}`}>
                  {k.up ? <ArrowUpRight className="size-3.5 mr-1" /> : <ArrowDownRight className="size-3.5 mr-1" />}
                  {Math.abs(k.delta)}% vs last week
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Revenue & bookings</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
            </div>
            <div className="flex gap-1 text-xs">
              {["7d", "30d", "90d"].map((t, i) => (
                <Button key={t} size="sm" variant={i === 0 ? "secondary" : "ghost"} className="h-7">
                  {t}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueSeries} margin={{ left: -10, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="rev" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="d" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                    formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#rev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service mix</CardTitle>
            <p className="text-xs text-muted-foreground">Share of revenue this month</p>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={serviceMix} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                    {serviceMix.map((_, i) => (
                      <Cell key={i} fill={chartColors[i % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 space-y-1.5 text-sm">
              {serviceMix.map((s, i) => (
                <li key={s.name} className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full" style={{ background: chartColors[i] }} />
                  <span className="flex-1 text-muted-foreground">{s.name}</span>
                  <span className="font-medium">{s.value}%</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Today's appointments</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">6 scheduled · 4 confirmed</p>
            </div>
            <Button size="sm" variant="ghost">View calendar</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcoming.map((a) => (
                  <TableRow key={a.time}>
                    <TableCell className="font-medium tabular-nums">{a.time}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-7"><AvatarFallback className="text-xs bg-accent">{a.client.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                        <span>{a.client}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{a.service}</TableCell>
                    <TableCell>{a.staff}</TableCell>
                    <TableCell>{statusBadge(a.status)}</TableCell>
                    <TableCell className="text-right tabular-nums">₹{a.amount.toLocaleString("en-IN")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>WhatsApp inbox</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">3 unread</p>
            </div>
            <Badge variant="secondary">Live</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {messages.map((m) => (
              <div key={m.name} className="flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                <Avatar className="size-9"><AvatarFallback className="bg-primary/10 text-primary text-xs">{m.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{m.name}</span>
                    <span className="text-[11px] text-muted-foreground">{m.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{m.text}</p>
                </div>
                {m.unread && <span className="size-2 rounded-full bg-primary mt-2" />}
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2">Open inbox</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Staff performance</CardTitle>
            <p className="text-xs text-muted-foreground">Bookings this week</p>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={staffPerf} margin={{ left: -10, right: 8, top: 8 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="bookings" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory alerts</CardTitle>
            <p className="text-xs text-muted-foreground">Stock below reorder level</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "L'Oréal Majirel 5.0", left: 3, total: 20 },
              { name: "OPI Gel Polish – Rose", left: 5, total: 24 },
              { name: "Argan Hair Serum 100ml", left: 2, total: 15 },
              { name: "Disposable Towels", left: 18, total: 100 },
            ].map((i) => (
              <div key={i.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium">{i.name}</span>
                  <span className="text-muted-foreground tabular-nums">{i.left}/{i.total}</span>
                </div>
                <Progress value={(i.left / i.total) * 100} className="h-1.5" />
              </div>
            ))}
            <Button variant="outline" className="w-full">Manage inventory</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
