import { CustomersClient } from "@/features/customers/components/customers-client";
import { listCustomers } from "@/features/customers/queries";

export default async function CustomersPage(props: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await props.searchParams;
  const raw = await listCustomers({ q, status });
  type CustomerRow = Awaited<ReturnType<typeof listCustomers>>[number];
  const customers = raw.map((c: CustomerRow) => ({
    id: c.id,
    name: c.name,
    phone: c.phone,
    address: c.address,
    favoriteScent: c.favoriteScent,
    socialLink: c.socialLink,
    notes: c.notes,
    status: c.status,
    lastEngagement: c.lastEngagement ? c.lastEngagement.toISOString() : null,
    lifetimeValue: c.lifetimeValue,
  }));

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-serif text-4xl font-semibold tracking-tight">
          Khách hàng
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Quản lý khách hàng, lịch sử mua, mùi hương yêu thích và trạng thái.
        </p>
      </div>

      <CustomersClient customers={customers} />
    </div>
  );
}
