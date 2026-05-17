"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download, Pencil, Plus, SlidersHorizontal, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { downloadCsv, toCsv } from "@/utils/csv";
import { deleteCustomerAction, upsertCustomerAction } from "@/features/customers/actions";
import { upsertCustomerSchema, type UpsertCustomerInput } from "@/features/customers/schemas";

type CustomerRow = {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  favoriteScent: string | null;
  socialLink: string | null;
  notes: string | null;
  status: "ACTIVE" | "INACTIVE" | "VIP";
  lastEngagement: string | null;
  lifetimeValue: string;
};

function selectClassName() {
  return cn(
    "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  );
}

export function CustomersClient({
  customers,
}: {
  customers: CustomerRow[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<CustomerRow | null>(null);

  const q = params.get("q") ?? "";
  const status = params.get("status") ?? "";

  const form = useForm<UpsertCustomerInput>({
    resolver: zodResolver(upsertCustomerSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      favoriteScent: "",
      socialLink: "",
      notes: "",
      status: "ACTIVE",
    },
  });

  React.useEffect(() => {
    if (!open) return;
    if (editing) {
      form.reset({
        id: editing.id,
        name: editing.name,
        phone: editing.phone ?? "",
        address: editing.address ?? "",
        favoriteScent: editing.favoriteScent ?? "",
        socialLink: editing.socialLink ?? "",
        notes: editing.notes ?? "",
        status: editing.status,
      });
    } else {
      form.reset({
        name: "",
        phone: "",
        address: "",
        favoriteScent: "",
        socialLink: "",
        notes: "",
        status: "ACTIVE",
      });
    }
  }, [open, editing, form]);

  const onSearch = (value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value.trim()) next.set("q", value);
    else next.delete("q");
    router.replace(`/customers?${next.toString()}`);
  };

  const onStatus = (value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set("status", value);
    else next.delete("status");
    router.replace(`/customers?${next.toString()}`);
  };

  const statusBadge = (s: CustomerRow["status"]) => {
    if (s === "VIP") return <Badge>VIP</Badge>;
    if (s === "INACTIVE") return <Badge variant="outline">INACTIVE</Badge>;
    return <Badge variant="secondary">ACTIVE</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1" />
        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) setEditing(null);
          }}
        >
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => downloadCsv("customers.csv", toCsv(customers))}
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditing(null);
                  setOpen(true);
                }}
              >
                <Plus className="h-4 w-4" />
                Add Customer
              </Button>
            </DialogTrigger>
          </div>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit customer" : "New customer"}</DialogTitle>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(async (values) => {
                const res = await upsertCustomerAction(values);
                if (res.ok) {
                  toast.success("Saved");
                  setOpen(false);
                  router.refresh();
                }
              })}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...form.register("name")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" {...form.register("phone")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select id="status" className={selectClassName()} {...form.register("status")}>
                    <option value="ACTIVE">Active</option>
                    <option value="VIP">VIP</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" {...form.register("address")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="favoriteScent">Signature accord</Label>
                  <Input id="favoriteScent" {...form.register("favoriteScent")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="socialLink">Social link</Label>
                  <Input id="socialLink" {...form.register("socialLink")} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" {...form.register("notes")} />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card/60">
        <CardContent className="pt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <select
                className={cn(selectClassName(), "max-w-[220px] bg-secondary/40")}
                value={status}
                onChange={(e) => onStatus(e.target.value)}
              >
                <option value="">All statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="VIP">VIP</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            <Input
              placeholder="Search customers…"
              defaultValue={q}
              onChange={(e) => onSearch(e.target.value)}
              className="sm:max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Signature Accord</TableHead>
                <TableHead>Last Engagement</TableHead>
                <TableHead className="text-right">Lifetime Value</TableHead>
                <TableHead className="text-right" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    No customers yet.
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/60 text-sm font-semibold">
                          {c.name.slice(0, 1).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/customers/${c.id}`}
                            className="truncate font-medium hover:underline"
                          >
                            {c.name}
                          </Link>
                          <div className="text-xs text-muted-foreground">
                            {c.address ?? "—"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {c.phone ?? "—"}
                    </TableCell>
                    <TableCell>{statusBadge(c.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {c.favoriteScent ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {c.lastEngagement
                        ? new Date(c.lastEngagement).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${Number(c.lifetimeValue).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Edit"
                          onClick={() => {
                            setEditing(c);
                            setOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Delete"
                          onClick={async () => {
                            if (!confirm("Delete this customer?")) return;
                            await deleteCustomerAction({ id: c.id });
                            toast.success("Deleted");
                            router.refresh();
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
