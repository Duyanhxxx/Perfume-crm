"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download, Plus } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { downloadCsv, toCsv } from "@/utils/csv";
import { createOrderAction } from "@/features/orders/actions";
import { createOrderSchema, type CreateOrderInput } from "@/features/orders/schemas";

type OrderRow = {
  id: string;
  createdAt: string;
  status: string;
  customer: string;
  items: string;
  total: string;
  profit: string;
};

type Option = { id: string; label: string; meta?: string };

function selectClassName() {
  return cn(
    "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  );
}

export function OrdersClient({
  orders,
  customers,
  products,
}: {
  orders: OrderRow[];
  customers: Option[];
  products: Option[];
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [tab, setTab] = React.useState<"ALL" | "PENDING" | "COMPLETED">("ALL");

  const filtered = React.useMemo(() => {
    if (tab === "ALL") return orders;
    if (tab === "PENDING")
      return orders.filter((o) => o.status === "PENDING" || o.status === "PACKING");
    return orders.filter((o) => o.status === "COMPLETED");
  }, [orders, tab]);

  const stats = React.useMemo(() => {
    const now = Date.now();
    const week = 7 * 24 * 60 * 60 * 1000;
    const ordersThisWeek = orders.filter(
      (o) => now - new Date(o.createdAt).getTime() < week,
    ).length;
    const pendingShipment = orders.filter(
      (o) => o.status === "PENDING" || o.status === "PACKING",
    ).length;
    return { ordersThisWeek, pendingShipment };
  }, [orders]);

  const form = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      customerId: "",
      status: "PENDING",
      currency: "USD",
      notes: "",
      items: [{ productId: products[0]?.id ?? "", quantity: 1 }],
    },
  });

  const items = useFieldArray({ control: form.control, name: "items" });

  const statusBadge = (s: string) => {
    if (s === "COMPLETED") return <Badge variant="secondary">COMPLETED</Badge>;
    if (s === "RETURNED") return <Badge variant="destructive">RETURNED</Badge>;
    if (s === "SHIPPING") return <Badge>SHIPPING</Badge>;
    if (s === "PACKING") return <Badge variant="outline">PACKING</Badge>;
    return <Badge variant="outline">PENDING</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <Button variant="secondary" onClick={() => downloadCsv("orders.csv", toCsv(orders))}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              Create Order
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New order</DialogTitle>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(async (values) => {
                try {
                  const res = await createOrderAction(values);
                  if (res.ok) {
                    toast.success("Order created");
                    setOpen(false);
                    router.refresh();
                  }
                } catch (e: unknown) {
                  const message =
                    e && typeof e === "object" && "message" in e
                      ? String((e as { message: unknown }).message)
                      : "Failed";
                  toast.error(message);
                }
              })}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="customerId">Customer</Label>
                  <select id="customerId" className={selectClassName()} {...form.register("customerId")}>
                    <option value="">Walk-in</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select id="status" className={selectClassName()} {...form.register("status")}>
                    <option value="PENDING">Pending</option>
                    <option value="PACKING">Packing</option>
                    <option value="SHIPPING">Shipping</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="RETURNED">Returned</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-medium">Items</div>
                <div className="space-y-2">
                  {items.fields.map((f, idx) => (
                    <div key={f.id} className="grid gap-2 sm:grid-cols-[1fr_120px_96px]">
                      <select
                        className={selectClassName()}
                        {...form.register(`items.${idx}.productId` as const)}
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.label}
                            {p.meta ? ` (${p.meta})` : ""}
                          </option>
                        ))}
                      </select>
                      <Input
                        inputMode="numeric"
                        {...form.register(`items.${idx}.quantity` as const)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => items.remove(idx)}
                        disabled={items.fields.length === 1}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    items.append({ productId: products[0]?.id ?? "", quantity: 1 })
                  }
                  disabled={products.length === 0}
                >
                  Add item
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input id="notes" {...form.register("notes")} />
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={products.length === 0}>
                  Create
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="bg-card/60 lg:col-span-2">
          <CardContent className="pt-6">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Orders this week
            </div>
            <div className="mt-2 flex items-end gap-4">
              <div className="font-serif text-5xl font-semibold">
                {stats.ordersThisWeek}
              </div>
              <div className="pb-2 text-xs text-primary">+14.5%</div>
            </div>
            <div className="mt-4 grid grid-cols-8 gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 rounded-md bg-accent"
                  style={{ opacity: 0.12 + i * 0.07 }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/60">
          <CardContent className="pt-6">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Pending shipment
            </div>
            <div className="mt-2 font-serif text-5xl font-semibold">
              {stats.pendingShipment}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Requires processing within 24h to meet luxury SLA.
            </div>
            <Button className="mt-4 w-full" variant="secondary">
              Review Queue
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={tab === "ALL" ? "secondary" : "ghost"}
          onClick={() => setTab("ALL")}
        >
          All
        </Button>
        <Button
          size="sm"
          variant={tab === "PENDING" ? "secondary" : "ghost"}
          onClick={() => setTab("PENDING")}
        >
          Pending
        </Button>
        <Button
          size="sm"
          variant={tab === "COMPLETED" ? "secondary" : "ghost"}
          onClick={() => setTab("COMPLETED")}
        >
          Completed
        </Button>
      </div>

      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    No orders yet.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">
                      #{o.id.slice(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{o.customer}</TableCell>
                    <TableCell className="text-muted-foreground">{o.items}</TableCell>
                    <TableCell className="font-medium">${o.total}</TableCell>
                    <TableCell>{statusBadge(o.status)}</TableCell>
                    <TableCell className="text-right">
                      <Link className="text-primary hover:underline" href={`/orders/${o.id}`}>
                        Invoice
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
