import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "@/lib/dashboard.functions";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Scissors,
  Package,
  CreditCard,
  MessageCircle,
  Megaphone,
  BarChart3,
  Settings,
  Sparkles,
  Bell,
  Search,
  FileText,
  Send,
  ScrollText,
  Zap,
  LogOut,
  UserCog,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const nav: Array<{
  label: string;
  icon: typeof LayoutDashboard;
  to: string;
  badge?: number;
  group?: string;
}> = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/" },
  { label: "Appointments", icon: CalendarDays, to: "/appointments" },
  { label: "Clients", icon: Users, to: "/clients" },
  { label: "Services", icon: Scissors, to: "/services" },
  { label: "Inventory", icon: Package, to: "/inventory" },
  { label: "Payments", icon: CreditCard, to: "/payments" },
  { label: "WhatsApp", icon: MessageCircle, to: "/whatsapp", badge: 3, group: "WhatsApp" },
  { label: "Templates", icon: FileText, to: "/whatsapp/templates", group: "WhatsApp" },
  { label: "Campaigns", icon: Send, to: "/whatsapp/campaigns", group: "WhatsApp" },
  { label: "Logs", icon: ScrollText, to: "/whatsapp/logs", group: "WhatsApp" },
  { label: "Automation", icon: Zap, to: "/whatsapp/automation", group: "WhatsApp" },
  { label: "Marketing", icon: Megaphone, to: "/marketing" },
  { label: "Reports", icon: BarChart3, to: "/reports" },
  { label: "Settings", icon: Settings, to: "/settings" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchMe = useServerFn(getCurrentUser);
  const { data: me } = useQuery({ queryKey: ["current-user"], queryFn: () => fetchMe() });

  const initials = (me?.fullName ?? me?.email ?? "U")
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const primaryRole = me?.roles?.[0] ?? null;

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  }


  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <aside className="hidden lg:flex w-64 flex-col border-r border-sidebar-border bg-sidebar min-h-screen sticky top-0">
          <div className="flex items-center gap-2 px-6 py-5 border-b border-sidebar-border">
            <div
              className="size-9 rounded-xl flex items-center justify-center text-primary-foreground"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Sparkles className="size-5" />
            </div>
            <div>
              <div className="font-semibold leading-tight">Harshil's</div>
              <div className="text-xs text-muted-foreground">Salon Suite</div>
            </div>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            {nav.map((item, idx) => {
              const Icon = item.icon;
              const active =
                item.to === "/"
                  ? pathname === "/"
                  : pathname === item.to || pathname.startsWith(item.to + "/");
              const showGroupLabel =
                item.group && nav[idx - 1]?.group !== item.group;
              return (
                <div key={item.to}>
                  {showGroupLabel && (
                    <div className="px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {item.group}
                    </div>
                  )}
                  <Link
                    to={item.to}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                    } ${item.group ? "ml-3" : ""}`}
                  >
                    <Icon className="size-4" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge ? (
                      <Badge className="h-5 px-1.5 text-[10px]" variant="secondary">
                        {item.badge}
                      </Badge>
                    ) : null}
                  </Link>
                </div>
              );
            })}
          </nav>
          <div className="m-3 p-4 rounded-xl text-sm" style={{ background: "var(--gradient-soft)" }}>
            <div className="font-medium">Trial · 12 days left</div>
            <p className="text-xs text-muted-foreground mt-1">Upgrade to unlock unlimited WhatsApp campaigns.</p>
            <Button size="sm" className="mt-3 w-full">Upgrade plan</Button>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <header className="sticky top-0 z-10 backdrop-blur bg-background/80 border-b border-border">
            <div className="flex items-center gap-3 px-4 lg:px-8 h-16">
              <div className="relative flex-1 max-w-md">
                <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search clients, appointments, services…" className="pl-9 bg-muted/40 border-transparent" />
              </div>
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="size-5" />
                <span className="absolute top-2 right-2 size-2 rounded-full bg-primary" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring">
                    <Avatar className="size-9">
                      {me?.avatarUrl ? <img src={me.avatarUrl} alt="" /> : null}
                      <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="font-medium truncate">{me?.fullName ?? me?.email ?? "Account"}</div>
                    {primaryRole ? (
                      <div className="text-xs text-muted-foreground capitalize">{primaryRole}</div>
                    ) : null}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}>
                    <Settings className="size-4 mr-2" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="text-rose-600 focus:text-rose-600">
                    <LogOut className="size-4 mr-2" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <div className="px-4 lg:px-8 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
