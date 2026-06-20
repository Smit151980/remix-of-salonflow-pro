import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/dashboard/AppShell";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, AlertTriangle } from "lucide-react";
import { mockInventory } from "@/lib/mock-data";
import { useRealtimeSubscription } from "@/hooks/use-realtime";

export const Route = createFileRoute("/inventory")({
  head: () => ({ meta: [{ title: "Inventory · Harshil's Salon Suite" }] }),
  component: () => <AppShell><InventoryPage /></AppShell>,
});

function InventoryPage() {
  useRealtimeSubscription("inventory");
  const low = mockInventory.filter((i) => i.stock <= i.reorder);
  return (
    <>
      <PageHeader
        title="Inventory"
        subtitle="Stock, reorder thresholds, and live alerts."
        actions={
          <Button style={{ background: "var(--gradient-primary)" }} className="text-primary-foreground border-0">
            <Plus className="size-4 mr-2" /> Add product
          </Button>
        }
      />
      {low.length > 0 && (
        <Card className="mb-6 border-amber-200 bg-amber-50/60">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="size-5 text-amber-600" />
            <div className="text-sm">
              <span className="font-medium">{low.length} products</span> are at or below reorder level.
            </div>
            <Button size="sm" variant="outline" className="ml-auto">Create purchase order</Button>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInventory.map((i) => {
                const pct = Math.min(100, (i.stock / Math.max(i.reorder * 2, 1)) * 100);
                const isLow = i.stock <= i.reorder;
                return (
                  <TableRow key={i.id}>
                    <TableCell className="font-medium">{i.name}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{i.sku}</TableCell>
                    <TableCell>{i.category}</TableCell>
                    <TableCell className="w-56">
                      <div className="flex items-center gap-2">
                        <Progress value={pct} className="h-1.5" />
                        <span className="text-xs text-muted-foreground tabular-nums">{i.stock}/{i.reorder}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">₹{i.price.toLocaleString("en-IN")}</TableCell>
                    <TableCell>
                      <Badge className={isLow ? "bg-amber-100 text-amber-800 border-0" : "bg-emerald-100 text-emerald-700 border-0"}>
                        {isLow ? "Reorder" : "OK"}
                      </Badge>
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
