import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/dashboard/AppShell";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Play, CalendarClock } from "lucide-react";
import { mockCampaigns, mockTemplates } from "@/lib/mock-data";

export const Route = createFileRoute("/whatsapp/campaigns")({
  head: () => ({ meta: [{ title: "Campaigns · Harshil's Salon Suite" }] }),
  component: () => <AppShell><CampaignsPage /></AppShell>,
});

const statusColor: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  scheduled: "bg-sky-100 text-sky-700",
  running: "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
  failed: "bg-rose-100 text-rose-700",
};

function CampaignsPage() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Campaigns"
        subtitle="Bulk WhatsApp sends, scheduled or instant."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button style={{ background: "var(--gradient-primary)" }} className="text-primary-foreground border-0">
                <Plus className="size-4 mr-2" />New campaign
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create campaign</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Campaign name</Label><Input placeholder="Diwali Glow Special" /></div>
                <div>
                  <Label>Template</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Pick a template" /></SelectTrigger>
                    <SelectContent>
                      {mockTemplates.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Audience segment</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select audience" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All active clients</SelectItem>
                      <SelectItem value="vip">VIP tier</SelectItem>
                      <SelectItem value="inactive">Inactive 90+ days</SelectItem>
                      <SelectItem value="bridal">Bridal segment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Schedule</Label><Input type="datetime-local" /></div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>Save draft</Button>
                <Button variant="secondary"><CalendarClock className="size-4 mr-2" />Schedule</Button>
                <Button onClick={() => setOpen(false)}><Play className="size-4 mr-2" />Send now</Button>
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
                <TableHead>Campaign</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Sent</TableHead>
                <TableHead className="text-right">Delivery %</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCampaigns.map((c) => {
                const pct = c.sent ? Math.round((c.delivered / c.sent) * 100) : 0;
                return (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-muted-foreground">{c.audience}</TableCell>
                    <TableCell>{c.scheduledAt ? c.scheduledAt.slice(0, 16).replace("T", " ") : "—"}</TableCell>
                    <TableCell><Badge className={`${statusColor[c.status]} border-0 capitalize`}>{c.status}</Badge></TableCell>
                    <TableCell className="text-right tabular-nums">{c.sent}</TableCell>
                    <TableCell className="text-right tabular-nums">{pct}%</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost">View</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
