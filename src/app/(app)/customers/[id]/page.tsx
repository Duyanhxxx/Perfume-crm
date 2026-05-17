import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RemindersClient } from "@/features/reminders/components/reminders-client";

export default async function CustomerDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { user } = await requireAuth();
  const { id } = await props.params;

  const customer = await prisma.customer.findFirst({
    where: { id, userId: user.id },
  });
  if (!customer) notFound();

  const [orders, reminders] = await Promise.all([
    prisma.order.findMany({
      where: { userId: user.id, customerId: customer.id },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    prisma.reminder.findMany({
      where: { userId: user.id, customerId: customer.id },
      orderBy: [{ completedAt: "asc" }, { dueAt: "asc" }],
      take: 200,
    }),
  ]);

  const status =
    customer.status === "VIP" ? (
      <Badge>VIP</Badge>
    ) : customer.status === "INACTIVE" ? (
      <Badge variant="outline">INACTIVE</Badge>
    ) : (
      <Badge variant="secondary">ACTIVE</Badge>
    );

  const lifetimeValue = orders.reduce((acc, o) => acc + Number(o.total.toString()), 0);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="font-serif text-4xl font-semibold tracking-tight">
              {customer.name}
            </h1>
            <div className="flex items-center gap-3">
              {status}
              <div className="text-sm text-muted-foreground">
                Lifetime value: <span className="text-foreground">${lifetimeValue.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <Link className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary hover:underline" href="/customers">
            Back
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <div className="text-muted-foreground">Phone</div>
              <div>{customer.phone ?? "—"}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Address</div>
              <div>{customer.address ?? "—"}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Signature accord</div>
              <div>{customer.favoriteScent ?? "—"}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Social</div>
              <div>
                {customer.socialLink ? (
                  <a className="text-primary hover:underline" href={customer.socialLink} target="_blank" rel="noreferrer">
                    {customer.socialLink}
                  </a>
                ) : (
                  "—"
                )}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Notes</div>
              <div>{customer.notes ?? "—"}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Reminders</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <RemindersClient
              customerId={customer.id}
              reminders={reminders.map((r) => ({
                id: r.id,
                dueAt: r.dueAt.toISOString(),
                completedAt: r.completedAt ? r.completedAt.toISOString() : null,
                note: r.note,
              }))}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Purchase history</CardTitle>
          <div className="text-sm text-muted-foreground">{orders.length} orders</div>
        </CardHeader>
        <CardContent className="pt-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    No orders yet.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.id.slice(0, 8).toUpperCase()}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {o.createdAt.toLocaleString()}
                    </TableCell>
                    <TableCell>${o.total.toString()}</TableCell>
                    <TableCell className="text-muted-foreground">{o.status}</TableCell>
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

