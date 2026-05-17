import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueChart } from "@/features/dashboard/components/revenue-chart";
import { bestSellers, revenueSeries } from "@/features/dashboard/mock";

export default function AnalyticsPage() {
  const totalRevenue = revenueSeries.reduce((acc, v) => acc + v.revenue, 0);
  const totalProfit = revenueSeries.reduce((acc, v) => acc + v.profit, 0);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-serif text-4xl font-semibold tracking-tight">
          Analytics
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Revenue, profit, orders, top products, and customer growth.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="bg-card/60 lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Revenue & Profit</CardTitle>
            <div className="text-sm text-muted-foreground">
              ${totalRevenue.toLocaleString()} / ${totalProfit.toLocaleString()}
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <RevenueChart data={revenueSeries} />
          </CardContent>
        </Card>
        <Card className="bg-card/60">
          <CardHeader>
            <CardTitle>Top products</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {bestSellers.map((p) => (
              <div key={p.name} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.brand}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">${p.revenue.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">{p.sold} sold</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
