import Link from "next/link";
import { notFound } from "next/navigation";

import { PrintButton } from "@/components/app/print-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function OrderInvoicePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { user } = await requireAuth();
  const { id } = await props.params;

  const order = await prisma.order.findFirst({
    where: { id, userId: user.id },
    include: {
      customer: true,
      items: { include: { product: true } },
    },
  });
  if (!order) notFound();

  const variant =
    order.status === "COMPLETED"
      ? ("secondary" as const)
      : order.status === "SHIPPING"
        ? ("default" as const)
        : ("outline" as const);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-serif text-4xl font-semibold tracking-tight">
            Invoice
          </h1>
          <div className="flex items-center gap-3">
            <Badge variant={variant}>{order.status}</Badge>
            <div className="text-sm text-muted-foreground">
              Order <span className="text-foreground">{order.id.slice(0, 8).toUpperCase()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary hover:underline" href="/orders">
            Back
          </Link>
          <PrintButton />
        </div>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Summary</CardTitle>
          <div className="text-sm text-muted-foreground">
            {order.createdAt.toLocaleString()}
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-2">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 text-sm">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Billed To
              </div>
              <div className="font-medium">{order.customer?.name ?? "Walk-in"}</div>
              <div className="text-muted-foreground">{order.customer?.phone ?? "—"}</div>
              <div className="text-muted-foreground">{order.customer?.address ?? "—"}</div>
            </div>
            <div className="space-y-2 text-sm md:text-right">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Totals
              </div>
              <div className="flex items-center justify-between gap-4 md:justify-end">
                <div className="text-muted-foreground md:hidden">Subtotal</div>
                <div className="font-medium">${order.subtotal.toString()}</div>
              </div>
              <div className="flex items-center justify-between gap-4 md:justify-end">
                <div className="text-muted-foreground md:hidden">Profit</div>
                <div className="font-medium text-primary">${order.profit.toString()}</div>
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-4 md:justify-end">
                <div className="text-muted-foreground md:hidden">Total</div>
                <div className="font-serif text-2xl font-semibold">
                  ${order.total.toString()}
                </div>
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">Line</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((i) => {
                const name = i.product?.name ?? "Product";
                const unit = i.unitPrice.toString();
                const line = (Number(unit) * i.quantity).toFixed(2);
                return (
                  <TableRow key={i.id}>
                    <TableCell className="font-medium">{name}</TableCell>
                    <TableCell className="text-muted-foreground">{i.quantity}</TableCell>
                    <TableCell className="text-muted-foreground">${unit}</TableCell>
                    <TableCell className="text-right font-medium">${line}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
