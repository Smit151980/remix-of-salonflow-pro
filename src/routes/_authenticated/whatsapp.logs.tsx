import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/dashboard/AppShell";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { mockLogs } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/whatsapp/logs")({
  head: () => ({ meta: [{ title: "Campaign Logs · Harshil's Salon Suite" }] }),
  component: () => <AppShell><LogsPage /></AppShell>,
});

const statusColor: Record<string, string> = {
  delivered: "bg-emerald-100 text-emerald-700",
  read: "bg-violet-100 text-violet-700",
  failed: "bg-rose-100 text-rose-700",
  queued: "bg-muted text-muted-foreground",
  sent: "bg-sky-100 text-sky-700",
};

const PAGE = 15;

function LogsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      mockLogs.filter(
        (l) =>
          (status === "all" || l.status === status) &&
          (!q || `${l.recipient} ${l.campaignName} ${l.messageId}`.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, status],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const rows = filtered.slice((page - 1) * PAGE, page * PAGE);

  return (
    <>
      <PageHeader title="Campaign logs" subtitle="Every message, with delivery state and timestamps." />
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative max-w-xs w-full">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search recipient or campaign" className="pl-9" />
            </div>
            <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="queued">Queued</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-xs text-muted-foreground ml-auto">{filtered.length} records</div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Message ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="text-muted-foreground text-xs">{new Date(l.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{l.campaignName}</TableCell>
                  <TableCell className="text-sm">{l.recipient}</TableCell>
                  <TableCell><Badge className={`${statusColor[l.status]} border-0 capitalize`}>{l.status}</Badge></TableCell>
                  <TableCell className="text-xs font-mono">{l.messageId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-muted-foreground">Page {page} of {pages}</div>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <Button size="sm" variant="outline" disabled={page === pages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
