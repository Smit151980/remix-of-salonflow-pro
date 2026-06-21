import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/dashboard/AppShell";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Search, UserPlus, Cake, Pencil, Trash2, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/clients")({
  head: () => ({ meta: [{ title: "Clients · Harshil's Salon Suite" }] }),
  component: () => <AppShell><ClientsPage /></AppShell>,
});

type Customer = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  date_of_birth: string | null;
  gender: "male" | "female" | "other" | null;
  address: string | null;
  loyalty_points: number;
  tags: string[];
  marketing_opt_in: boolean;
  created_at: string;
};

function ClientsPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("full_name");
      if (error) throw error;
      return data as Customer[];
    },
  });

  const rows = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return customers;
    return customers.filter((c) =>
      `${c.full_name} ${c.phone ?? ""} ${c.email ?? ""}`.toLowerCase().includes(s),
    );
  }, [customers, q]);

  const thisMonth = new Date().getMonth();
  const stats = [
    { label: "Total clients", value: customers.length, icon: UserPlus },
    {
      label: "Birthdays this month",
      value: customers.filter((c) => c.date_of_birth && new Date(c.date_of_birth).getMonth() === thisMonth).length,
      icon: Cake,
    },
    {
      label: "Marketing opt-in",
      value: customers.filter((c) => c.marketing_opt_in).length,
      icon: MessageCircle,
    },
  ];

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("customers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Client deleted"); qc.invalidateQueries({ queryKey: ["customers"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <PageHeader
        title="Clients"
        subtitle="Customer directory with contacts, loyalty and birthdays."
        actions={<CustomerDialog />}
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
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, phone, email" className="pl-9" />
          </div>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : rows.length === 0 ? (
            <div className="text-sm text-muted-foreground py-8 text-center">No clients yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Loyalty</TableHead>
                  <TableHead>Birthday</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-8"><AvatarFallback className="text-xs bg-accent">{initials(c.full_name)}</AvatarFallback></Avatar>
                        <div>
                          <div className="text-sm">{c.full_name}</div>
                          {c.tags.length > 0 && (
                            <div className="text-xs text-muted-foreground">{c.tags.join(", ")}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{c.phone ?? "—"}</TableCell>
                    <TableCell className="text-sm">{c.email ?? "—"}</TableCell>
                    <TableCell className="text-right tabular-nums">{c.loyalty_points}</TableCell>
                    <TableCell className="text-sm">{c.date_of_birth?.slice(5) ?? "—"}</TableCell>
                    <TableCell className="text-right">
                      <CustomerDialog customer={c} trigger={
                        <Button size="sm" variant="ghost"><Pencil className="size-3.5" /></Button>
                      } />
                      <Button size="sm" variant="ghost" onClick={() => { if (confirm(`Delete ${c.full_name}?`)) del.mutate(c.id); }}>
                        <Trash2 className="size-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}

function initials(name: string) {
  return name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function CustomerDialog({ customer, trigger }: { customer?: Customer; trigger?: React.ReactNode }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    full_name: customer?.full_name ?? "",
    phone: customer?.phone ?? "",
    email: customer?.email ?? "",
    date_of_birth: customer?.date_of_birth ?? "",
    gender: customer?.gender ?? "",
    address: customer?.address ?? "",
    loyalty_points: customer?.loyalty_points ?? 0,
    tags: customer?.tags.join(", ") ?? "",
    marketing_opt_in: customer?.marketing_opt_in ?? true,
  });
  const m = useMutation({
    mutationFn: async () => {
      if (!form.full_name.trim()) throw new Error("Name is required");
      const payload = {
        full_name: form.full_name.trim(),
        phone: form.phone || null,
        email: form.email || null,
        date_of_birth: form.date_of_birth || null,
        gender: (form.gender || null) as Customer["gender"],
        address: form.address || null,
        loyalty_points: Number(form.loyalty_points) || 0,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        marketing_opt_in: form.marketing_opt_in,
      };
      if (customer) {
        const { error } = await supabase.from("customers").update(payload).eq("id", customer.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("customers").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(customer ? "Client updated" : "Client added");
      qc.invalidateQueries({ queryKey: ["customers"] });
      setOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button style={{ background: "var(--gradient-primary)" }} className="text-primary-foreground border-0">
            <Plus className="size-4 mr-2" />Add client
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{customer ? "Edit client" : "New client"}</DialogTitle></DialogHeader>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          <div className="space-y-2">
            <Label>Full name</Label>
            <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91…" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Date of birth</Label>
              <Input type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={form.gender || "unset"} onValueChange={(v) => setForm({ ...form, gender: v === "unset" ? "" : v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="unset">—</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Loyalty points</Label>
              <Input type="number" min={0} value={form.loyalty_points} onChange={(e) => setForm({ ...form, loyalty_points: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Tags (comma-sep)</Label>
              <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="VIP, Bridal" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Marketing opt-in</Label>
            <Switch checked={form.marketing_opt_in} onCheckedChange={(v) => setForm({ ...form, marketing_opt_in: v })} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => m.mutate()} disabled={m.isPending}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
