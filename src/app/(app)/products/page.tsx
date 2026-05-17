import { ProductsClient } from "@/features/products/components/products-client";
import { listProducts } from "@/features/products/queries";

export default async function ProductsPage(props: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await props.searchParams;
  const raw = await listProducts({ q });
  type ProductRow = Awaited<ReturnType<typeof listProducts>>[number];
  const products = raw.map((p: ProductRow) => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    volumeMl: p.volumeMl,
    costPrice: p.costPrice.toString(),
    sellPrice: p.sellPrice.toString(),
    stock: p.stock,
    lowStockThreshold: p.lowStockThreshold,
    description: p.description,
    imageUrl: p.imageUrl,
  }));

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-serif text-4xl font-semibold tracking-tight">
          Products
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Track inventory, pricing, and low stock alerts across your catalog.
        </p>
      </div>

      <ProductsClient products={products} />
    </div>
  );
}
