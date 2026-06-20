import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/dashboard/AppShell";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Copy, Edit, Trash2 } from "lucide-react";
import { mockTemplates } from "@/lib/mock-data";

export const Route = createFileRoute("/whatsapp/templates")({
  head: () => ({ meta: [{ title: "WhatsApp Templates · Harshil's Salon Suite" }] }),
  component: () => <AppShell><TemplatesPage /></AppShell>,
});

const statusColor: Record<string, string> = {
  approved: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-rose-100 text-rose-700",
};

function TemplatesPage() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("marketing");
  const [header, setHeader] = useState("");
  const [body, setBody] = useState("Hi {{1}}, ");
  const [footer, setFooter] = useState("Harshil's Salon");

  return (
    <>
      <PageHeader
        title="Templates"
        subtitle="Reusable WhatsApp message templates pending approval or live."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button style={{ background: "var(--gradient-primary)" }} className="text-primary-foreground border-0">
                <Plus className="size-4 mr-2" />New template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader><DialogTitle>Create template</DialogTitle></DialogHeader>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="appointment_reminder_v2" /></div>
                  <div>
                    <Label>Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="utility">Utility</SelectItem>
                        <SelectItem value="authentication">Authentication</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Header</Label><Input value={header} onChange={(e) => setHeader(e.target.value)} placeholder="✨ 20% OFF" /></div>
                  <div><Label>Body</Label><Textarea rows={5} value={body} onChange={(e) => setBody(e.target.value)} /></div>
                  <div><Label>Footer</Label><Input value={footer} onChange={(e) => setFooter(e.target.value)} /></div>
                </div>
                <div>
                  <Label>Preview</Label>
                  <div className="mt-2 rounded-2xl bg-[#e5ddd5] p-4 min-h-[280px]">
                    <div className="max-w-xs bg-white rounded-lg shadow-sm p-3 text-sm">
                      {header && <div className="font-semibold mb-1">{header}</div>}
                      <div className="whitespace-pre-wrap">{body}</div>
                      {footer && <div className="text-xs text-muted-foreground mt-2">{footer}</div>}
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={() => setOpen(false)}>Submit for approval</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTemplates.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="capitalize">{t.category}</TableCell>
                  <TableCell>{t.language.toUpperCase()}</TableCell>
                  <TableCell><Badge className={`${statusColor[t.status]} border-0 capitalize`}>{t.status}</Badge></TableCell>
                  <TableCell>{t.createdAt.slice(0, 10)}</TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost"><Edit className="size-4" /></Button>
                    <Button size="icon" variant="ghost"><Copy className="size-4" /></Button>
                    <Button size="icon" variant="ghost"><Trash2 className="size-4 text-rose-600" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
