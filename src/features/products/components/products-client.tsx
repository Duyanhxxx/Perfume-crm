"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download, Pencil, Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { downloadCsv, toCsv } from "@/utils/csv";
import { deleteProductAction, upsertProductAction } from "@/features/products/actions";
import { upsertProductSchema, type UpsertProductInput } from "@/features/products/schemas";

type ProductRow = {
  id: string;
  name: string;
  brand: string | null;
  volumeMl: number | null;
  costPrice: string;
  sellPrice: string;
  stock: number;
  lowStockThreshold: number;
  description: string | null;
  imageUrl: string | null;
};

export function ProductsClient({ products }: { products: ProductRow[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ProductRow | null>(null);

  const q = params.get("q") ?? "";

  const form = useForm<UpsertProductInput>({
    resolver: zodResolver(upsertProductSchema),
    defaultValues: {
      name: "",
      brand: "",
      volumeMl: undefined,
      costPrice: "0",
      sellPrice: "0",
      stock: 0,
      lowStockThreshold: 5,
      description: "",
      imageUrl: "",
    },
  });

  React.useEffect(() => {
    if (!open) return;
    if (editing) {
      form.reset({
        id: editing.id,
        name: editing.name,
        brand: editing.brand ?? "",
        volumeMl: editing.volumeMl ?? undefined,
        costPrice: editing.costPrice,
        sellPrice: editing.sellPrice,
        stock: editing.stock,
        lowStockThreshold: editing.lowStockThreshold,
        description: editing.description ?? "",
        imageUrl: editing.imageUrl ?? "",
      });
    } else {
      form.reset({
        name: "",
        brand: "",
        volumeMl: undefined,
        costPrice: "0",
        sellPrice: "0",
        stock: 0,
        lowStockThreshold: 5,
        description: "",
        imageUrl: "",
      });
    }
  }, [open, editing, form]);

  const onSearch = (value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value.trim()) next.set("q", value);
    else next.delete("q");
    router.replace(`/products?${next.toString()}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <Button variant="secondary" onClick={() => downloadCsv("products.csv", toCsv(products))}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) setEditing(null);
          }}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit product" : "New product"}</DialogTitle>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(async (values) => {
                const res = await upsertProductAction(values);
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
                  <Label htmlFor="brand">Brand</Label>
                  <Input id="brand" {...form.register("brand")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="volumeMl">Volume (ml)</Label>
                  <Input id="volumeMl" inputMode="numeric" {...form.register("volumeMl")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costPrice">Cost price</Label>
                  <Input id="costPrice" inputMode="decimal" {...form.register("costPrice")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellPrice">Sell price</Label>
                  <Input id="sellPrice" inputMode="decimal" {...form.register("sellPrice")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input id="stock" inputMode="numeric" {...form.register("stock")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lowStockThreshold">Low stock alert</Label>
                  <Input id="lowStockThreshold" inputMode="numeric" {...form.register("lowStockThreshold")} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input id="imageUrl" {...form.register("imageUrl")} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" {...form.register("description")} />
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
          <Input
            placeholder="Search products…"
            defaultValue={q}
            onChange={(e) => onSearch(e.target.value)}
            className="sm:max-w-sm"
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                    No products yet.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((p) => {
                  const low = p.stock <= p.lowStockThreshold;
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="text-muted-foreground">{p.brand ?? "—"}</TableCell>
                      <TableCell className={low ? "text-primary" : "text-muted-foreground"}>
                        {p.stock} <span className="text-xs text-muted-foreground">/ {p.lowStockThreshold}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setEditing(p);
                              setOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={async () => {
                              if (!confirm("Delete this product?")) return;
                              await deleteProductAction({ id: p.id });
                              toast.success("Deleted");
                              router.refresh();
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
