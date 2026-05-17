import { ArrowUpRight, Package, Receipt, TrendingUp, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RevenueChart } from "@/features/dashboard/components/revenue-chart";
import { bestSellers, recentOrders, revenueSeries } from "@/features/dashboard/mock";

function statusVariant(status: string) {
  if (status === "COMPLETED") return "secondary" as const;
  if (status === "SHIPPING") return "default" as const;
  if (status === "PACKING") return "outline" as const;
  return "outline" as const;
}

export default function DashboardPage() {
  const vnd = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });
  const totalRevenue = revenueSeries.reduce((acc, v) => acc + v.revenue, 0);
  const totalOrders = revenueSeries.reduce((acc, v) => acc + v.orders, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-serif text-4xl font-semibold tracking-tight">
            Tổng quan
          </h1>
          <p className="text-sm text-muted-foreground">
            Tình hình hoạt động của bạn trong nháy mắt.
          </p>
        </div>
        <Button>
          Xuất báo cáo
          <ArrowUpRight className="ml-2 h-4 w-4 text-primary" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Doanh thu hôm nay
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="font-serif text-3xl font-semibold">
              {vnd.format(Math.round(totalRevenue / 7))}
            </div>
            <div className="text-xs text-primary">+14.2%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Doanh thu tháng
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="font-serif text-3xl font-semibold">
              {vnd.format(totalRevenue * 4)}
            </div>
            <div className="text-xs text-primary">+8.4%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Tổng đơn hàng
            </CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="font-serif text-3xl font-semibold">
              {(totalOrders * 7).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Trong tháng</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Đơn chờ xử lý
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="font-serif text-3xl font-semibold">12</div>
            <div className="text-xs text-muted-foreground">Cần xử lý</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Revenue vs Profit</CardTitle>
            <div className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Doanh thu
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[rgba(228,226,225,0.35)]" />
                Lợi nhuận
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <RevenueChart data={revenueSeries} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Bán chạy</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-4">
              {bestSellers.map((p, idx) => (
                <div key={p.name}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-secondary/60" />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{p.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {p.brand}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">{p.sold}</div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        Số lượng
                      </div>
                    </div>
                  </div>
                  {idx !== bestSellers.length - 1 ? (
                    <Separator className="mt-4 opacity-60" />
                  ) : null}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Đơn gần đây</CardTitle>
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
            Xem tất cả
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Đơn</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Tổng</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{o.id}</TableCell>
                  <TableCell>{o.customer}</TableCell>
                  <TableCell>{vnd.format(o.total)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(o.status)}>{o.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
