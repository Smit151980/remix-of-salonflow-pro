import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/dashboard/AppShell";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Zap, Cake, Clock, CalendarX, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/whatsapp/automation")({
  head: () => ({ meta: [{ title: "Automation · Harshil's Salon Suite" }] }),
  component: () => <AppShell><AutomationPage /></AppShell>,
});

const flows = [
  { name: "Birthday wishes", trigger: "Customer DOB", action: "Send 'Birthday Wishes' template", schedule: "9:00 AM on birthday", icon: Cake, active: true, sent: 312, success: 99 },
  { name: "Win-back inactive clients", trigger: "No visit in 90 days", action: "Send 'Promotional Offer'", schedule: "Daily 11 AM", icon: Clock, active: true, sent: 184, success: 95 },
  { name: "Appointment reminder T-24h", trigger: "Appointment in 24h", action: "Send 'Appointment Reminder'", schedule: "Hourly check", icon: CalendarX, active: true, sent: 642, success: 98 },
  { name: "Post-visit feedback", trigger: "Appointment completed", action: "Send 'Feedback Request' +2h", schedule: "On event", icon: CheckCircle2, active: false, sent: 0, success: 0 },
  { name: "Membership renewal reminder", trigger: "Membership expires in 7d", action: "Send 'Membership Renewal'", schedule: "Daily 10 AM", icon: Zap, active: true, sent: 47, success: 100 },
];

function AutomationPage() {
  return (
    <>
      <PageHeader
        title="Automation"
        subtitle="Trigger → condition → action. Runs in the background, no duplicate sends."
        actions={
          <Button style={{ background: "var(--gradient-primary)" }} className="text-primary-foreground border-0">
            <Plus className="size-4 mr-2" />New automation
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-2">
        {flows.map((f) => {
          const Icon = f.icon;
          return (
            <Card key={f.name}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-lg bg-accent flex items-center justify-center text-primary"><Icon className="size-5" /></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{f.name}</span>
                      {f.active ? <Badge className="bg-emerald-100 text-emerald-700 border-0">Active</Badge> : <Badge variant="secondary">Paused</Badge>}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground space-y-1">
                      <div><span className="font-medium text-foreground">Trigger:</span> {f.trigger}</div>
                      <div><span className="font-medium text-foreground">Action:</span> {f.action}</div>
                      <div><span className="font-medium text-foreground">Schedule:</span> {f.schedule}</div>
                    </div>
                  </div>
                  <Switch defaultChecked={f.active} />
                </div>
                <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{f.sent} messages sent · {f.success}% success</span>
                  <Button size="sm" variant="ghost">Edit</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
