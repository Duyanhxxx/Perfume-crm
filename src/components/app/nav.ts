import {
  BarChart3,
  LayoutDashboard,
  Package,
  Receipt,
  Settings,
  Users,
  Calendar,
} from "lucide-react";

export const navItems = [
  { href: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/customers", label: "Khách hàng", icon: Users },
  { href: "/orders", label: "Đơn hàng", icon: Receipt },
  { href: "/products", label: "Sản phẩm", icon: Package },
  { href: "/content", label: "Nội dung", icon: Calendar },
  { href: "/analytics", label: "Phân tích", icon: BarChart3 },
  { href: "/settings", label: "Cài đặt", icon: Settings },
] as const;
