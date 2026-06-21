import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/dashboard/AppShell";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Mail, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/staff")({
  head: () => ({ meta: [{ title: "Staff · Harshil's Salon Suite" }] }),
  component: () => <AppShell><StaffPage /></AppShell>,
});

type Staff = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  role_title: string | null;
  specialties: string[];
  commission_pct: number;
  color: string | null;
  active: boolean;
};

function StaffPage() {
  const qc = useQueryClient();
  const { data: staff = [], isLoading } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const { data, error } = await supabase.from("staff").select("*").order("full_name");
      if (error) throw error;
      return data as Staff[];
    },
  });
  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("staff").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Staff removed"); qc.invalidateQueries({ queryKey: ["staff"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <PageHeader
        title="Staff"
        subtitle="Manage team members, specialties and commission."
        actions={<StaffDialog />}
      />
      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : staff.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">
          No staff yet. Add your first team member.
        </CardContent></Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {staff.map((s) => (
            <Card key={s.id}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <Avatar className="size-12">
                    <AvatarFallback className="bg-accent text-primary" style={s.color ? { background: s.color, color: "white" } : undefined}>
                      {s.full_name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{s.full_name}</div>
                    <div className="text-xs text-muted-foreground">{s.role_title ?? "—"}</div>
                    {!s.active && <Badge variant="secondary" className="mt-1">Inactive</Badge>}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  {s.email && <div className="flex items-center gap-1"><Mail className="size-3" />{s.email}</div>}
                  {s.phone && <div className="flex items-center gap-1"><Phone className="size-3" />{s.phone}</div>}
                </div>
                {s.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {s.specialties.map((sp) => <Badge key={sp} variant="secondary">{sp}</Badge>)}
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-muted-foreground">{s.commission_pct}% commission</span>
                  <div className="flex gap-1">
                    <StaffDialog staff={s} trigger={<Button size="sm" variant="ghost"><Pencil className="size-3.5" /></Button>} />
                    <Button size="sm" variant="ghost" onClick={() => { if (confirm(`Remove ${s.full_name}?`)) del.mutate(s.id); }}>
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

function StaffDialog({ staff, trigger }: { staff?: Staff; trigger?: React.ReactNode }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    full_name: staff?.full_name ?? "",
    email: staff?.email ?? "",
    phone: staff?.phone ?? "",
    role_title: staff?.role_title ?? "",
    specialties: staff?.specialties.join(", ") ?? "",
    commission_pct: staff?.commission_pct ?? 0,
    color: staff?.color ?? "",
    active: staff?.active ?? true,
  });
  const m = useMutation({
    mutationFn: async () => {
      if (!form.full_name.trim()) throw new Error("Name required");
      const payload = {
        full_name: form.full_name.trim(),
        email: form.email || null,
        phone: form.phone || null,
        role_title: form.role_title || null,
        specialties: form.specialties.split(",").map((t) => t.trim()).filter(Boolean),
        commission_pct: Number(form.commission_pct) || 0,
        color: form.color || null,
        active: form.active,
      };
      if (staff) {
        const { error } = await supabase.from("staff").update(payload).eq("id", staff.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("staff").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(staff ? "Staff updated" : "Staff added");
      qc.invalidateQueries({ queryKey: ["staff"] });
      setOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button style={{ background: "var(--gradient-primary)" }} className="text-primary-foreground border-0">
            <Plus className="size-4 mr-2" />Add staff
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{staff ? "Edit staff" : "New staff"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Full name</Label>
            <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Role title</Label>
              <Input value={form.role_title} onChange={(e) => setForm({ ...form, role_title: e.target.value })} placeholder="Senior Stylist" />
            </div>
            <div className="space-y-2">
              <Label>Commission %</Label>
              <Input type="number" min={0} max={100} step="0.1" value={form.commission_pct} onChange={(e) => setForm({ ...form, commission_pct: Number(e.target.value) })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Specialties (comma-sep)</Label>
            <Input value={form.specialties} onChange={(e) => setForm({ ...form, specialties: e.target.value })} placeholder="Color, Balayage, Bridal" />
          </div>
          <div className="space-y-2">
            <Label>Accent color</Label>
            <Input type="color" value={form.color || "#a855f7"} onChange={(e) => setForm({ ...form, color: e.target.value })} className="h-10 w-20" />
          </div>
          <div className="flex items-center justify-between">
            <Label>Active</Label>
            <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => m.mutate()} disabled={m.isPending}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
