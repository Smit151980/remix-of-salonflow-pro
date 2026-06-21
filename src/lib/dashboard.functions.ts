import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type DashboardStats = {
  todayRevenue: number;
  monthRevenue: number;
  appointmentsToday: number;
  appointmentsThisWeek: number;
  totalCustomers: number;
  newCustomersThisMonth: number;
  pendingAppointments: number;
  lowStockCount: number;
};

export const getDashboardStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<DashboardStats> => {
    const { supabase } = context;
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const [{ count: totalCustomers }, { count: newCustomersThisMonth }] = await Promise.all([
      supabase.from("customers").select("id", { count: "exact", head: true }),
      supabase.from("customers").select("id", { count: "exact", head: true }).gte("created_at", monthStart),
    ]);
    return {
      todayRevenue: 0,
      monthRevenue: 0,
      appointmentsToday: 0,
      appointmentsThisWeek: 0,
      totalCustomers: totalCustomers ?? 0,
      newCustomersThisMonth: newCustomersThisMonth ?? 0,
      pendingAppointments: 0,
      lowStockCount: 0,
    };
  });

export type CurrentUser = {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  roles: Array<"owner" | "manager" | "receptionist" | "staff">;
};

export const getCurrentUser = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CurrentUser> => {
    const { supabase, userId } = context;
    const [{ data: profile }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("id,email,full_name,avatar_url").eq("id", userId).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", userId),
    ]);
    return {
      id: userId,
      email: profile?.email ?? "",
      fullName: profile?.full_name ?? null,
      avatarUrl: profile?.avatar_url ?? null,
      roles: (roles ?? []).map((r) => r.role) as CurrentUser["roles"],
    };
  });
