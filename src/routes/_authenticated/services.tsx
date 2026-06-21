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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Clock, IndianRupee, Tag, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/services")({
  head: () => ({ meta: [{ title: "Services · Harshil's Salon Suite" }] }),
  component: () => <AppShell><ServicesPage /></AppShell>,
});

type Category = { id: string; name: string; sort_order: number; active: boolean };
type Service = {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number;
  active: boolean;
};

function ServicesPage() {
  const qc = useQueryClient();
  const catsQ = useQuery({
    queryKey: ["service_categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_categories")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as Category[];
    },
  });
  const svcQ = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("name");
      if (error) throw error;
      return data as Service[];
    },
  });

  const cats = catsQ.data ?? [];
  const services = svcQ.data ?? [];
  const grouped = services.reduce<Record<string, Service[]>>((acc, s) => {
    const key = s.category_id ?? "uncategorized";
    (acc[key] ||= []).push(s);
    return acc;
  }, {});

  const delSvc = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Service deleted"); qc.invalidateQueries({ queryKey: ["services"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <PageHeader
        title="Services"
        subtitle="Menu of services with pricing and duration."
        actions={
          <div className="flex gap-2">
            <CategoryDialog />
            <ServiceDialog categories={cats} />
          </div>
        }
      />
      {svcQ.isLoading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : services.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">
          No services yet. Create a category, then add your first service.
        </CardContent></Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([catId, items]) => {
            const cat = cats.find((c) => c.id === catId);
            return (
              <section key={catId}>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="font-semibold">{cat?.name ?? "Uncategorized"}</h2>
                  <Badge variant="secondary">{items.length}</Badge>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((s) => (
                    <Card key={s.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-medium truncate">{s.name}</div>
                            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
                              <span className="inline-flex items-center gap-1"><Clock className="size-3" />{s.duration_minutes}m</span>
                              {!s.active && <Badge variant="secondary">Inactive</Badge>}
                            </div>
                            {s.description && (
                              <div className="text-xs text-muted-foreground mt-2 line-clamp-2">{s.description}</div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold tabular-nums inline-flex items-center"><IndianRupee className="size-4" />{Number(s.price).toLocaleString("en-IN")}</div>
                          </div>
                        </div>
                        <div className="flex justify-end gap-1 mt-3">
                          <ServiceDialog categories={cats} service={s} trigger={
                            <Button size="sm" variant="ghost"><Pencil className="size-3.5" /></Button>
                          } />
                          <Button
                            size="sm" variant="ghost"
                            onClick={() => { if (confirm(`Delete "${s.name}"?`)) delSvc.mutate(s.id); }}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}

function CategoryDialog() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const m = useMutation({
    mutationFn: async () => {
      if (!name.trim()) throw new Error("Name required");
      const { error } = await supabase.from("service_categories").insert({ name: name.trim() });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Category added");
      qc.invalidateQueries({ queryKey: ["service_categories"] });
      setOpen(false); setName("");
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="outline"><Tag className="size-4 mr-2" />New category</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>New category</DialogTitle></DialogHeader>
        <div className="space-y-2">
          <Label>Category name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Hair, Nails, Spa…" />
        </div>
        <DialogFooter>
          <Button onClick={() => m.mutate()} disabled={m.isPending}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ServiceDialog({
  categories, service, trigger,
}: { categories: Category[]; service?: Service; trigger?: React.ReactNode }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: service?.name ?? "",
    description: service?.description ?? "",
    category_id: service?.category_id ?? "",
    duration_minutes: service?.duration_minutes ?? 30,
    price: service?.price ?? 0,
    active: service?.active ?? true,
  });
  const m = useMutation({
    mutationFn: async () => {
      if (!form.name.trim()) throw new Error("Name required");
      const payload = {
        name: form.name.trim(),
        description: form.description || null,
        category_id: form.category_id || null,
        duration_minutes: Number(form.duration_minutes),
        price: Number(form.price),
        active: form.active,
      };
      if (service) {
        const { error } = await supabase.from("services").update(payload).eq("id", service.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("services").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(service ? "Service updated" : "Service added");
      qc.invalidateQueries({ queryKey: ["services"] });
      setOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button style={{ background: "var(--gradient-primary)" }} className="text-primary-foreground border-0">
            <Plus className="size-4 mr-2" />Add service
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{service ? "Edit service" : "New service"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={form.category_id || "none"} onValueChange={(v) => setForm({ ...form, category_id: v === "none" ? "" : v })}>
              <SelectTrigger><SelectValue placeholder="Pick a category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Uncategorized</SelectItem>
                {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Duration (min)</Label>
              <Input type="number" min={1} value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Price (₹)</Label>
              <Input type="number" min={0} step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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
