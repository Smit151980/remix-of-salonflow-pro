import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/dashboard/AppShell";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Clock, IndianRupee, Tag } from "lucide-react";
import { mockServices } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/services")({
  head: () => ({ meta: [{ title: "Services · Harshil's Salon Suite" }] }),
  component: () => <AppShell><ServicesPage /></AppShell>,
});

function ServicesPage() {
  const grouped = mockServices.reduce<Record<string, typeof mockServices>>((acc, s) => {
    (acc[s.category] ||= []).push(s);
    return acc;
  }, {});

  return (
    <>
      <PageHeader
        title="Services"
        subtitle="Menu of services with pricing and demand."
        actions={
          <Button style={{ background: "var(--gradient-primary)" }} className="text-primary-foreground border-0">
            <Plus className="size-4 mr-2" /> Add service
          </Button>
        }
      />
      <div className="space-y-8">
        {Object.entries(grouped).map(([cat, items]) => (
          <section key={cat}>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="font-semibold">{cat}</h2>
              <Badge variant="secondary">{items.length}</Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((s) => (
                <Card key={s.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
                          <span className="inline-flex items-center gap-1"><Clock className="size-3" />{s.duration}m</span>
                          <span className="inline-flex items-center gap-1"><Tag className="size-3" />{s.bookings} bookings</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold tabular-nums inline-flex items-center"><IndianRupee className="size-4" />{s.price.toLocaleString("en-IN")}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
