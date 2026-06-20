import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/dashboard/AppShell";
import { Dashboard } from "@/components/dashboard/Dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · Harshil's Salon Suite" },
      { name: "description", content: "Salon management dashboard with revenue, appointments, WhatsApp inbox, and staff performance." },
      { property: "og:title", content: "Harshil's Salon Suite" },
      { property: "og:description", content: "Run your salon end-to-end: bookings, clients, payments, and WhatsApp automation." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <AppShell>
      <Dashboard />
    </AppShell>
  );
}
