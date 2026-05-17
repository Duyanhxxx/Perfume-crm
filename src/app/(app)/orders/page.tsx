import { OrdersClient } from "@/features/orders/components/orders-client";
import { listOrders } from "@/features/orders/queries";
import { listCustomers } from "@/features/customers/queries";
import { listProducts } from "@/features/products/queries";

export default async function OrdersPage() {
  const [ordersRaw, customersRaw, productsRaw] = await Promise.all([
    listOrders(),
    listCustomers(),
    listProducts(),
  ]);

  type OrderRow = Awaited<ReturnType<typeof listOrders>>[number];
  const orders = ordersRaw.map((o: OrderRow) => ({
    id: o.id,
    createdAt: o.createdAt.toISOString(),
    status: o.status,
    customer: o.customer?.name ?? "Khách lẻ",
    items: (() => {
      const names = o.items
        .map((i) => i.product?.name ?? i.productName)
        .filter((v): v is string => Boolean(v));
      if (names.length === 0) return "—";
      const head = names.slice(0, 2).join(", ");
      const tail = names.length > 2 ? ` +${names.length - 2}` : "";
      return `${head}${tail}`;
    })(),
    total: o.total.toString(),
    profit: o.profit.toString(),
  }));

  type CustomerRow = Awaited<ReturnType<typeof listCustomers>>[number];
  const customers = customersRaw.map((c: CustomerRow) => ({
    id: c.id,
    label: c.name,
  }));

  type ProductRow = Awaited<ReturnType<typeof listProducts>>[number];
  const products = productsRaw.map((p: ProductRow) => ({
    id: p.id,
    label: p.name,
    meta: `tồn kho ${p.stock}`,
  }));

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-serif text-4xl font-semibold tracking-tight">
          Quản lý đơn hàng
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Xem và xử lý các đơn hàng. Đảm bảo đóng gói và giao hàng đúng hạn.
        </p>
      </div>

      <OrdersClient orders={orders} customers={customers} products={products} />
    </div>
  );
}
