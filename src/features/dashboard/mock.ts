export const revenueSeries = [
  { date: "Mon", revenue: 820, profit: 260, orders: 12 },
  { date: "Tue", revenue: 1240, profit: 410, orders: 18 },
  { date: "Wed", revenue: 980, profit: 320, orders: 14 },
  { date: "Thu", revenue: 1420, profit: 520, orders: 22 },
  { date: "Fri", revenue: 1680, profit: 640, orders: 26 },
  { date: "Sat", revenue: 1320, profit: 470, orders: 20 },
  { date: "Sun", revenue: 1510, profit: 560, orders: 24 },
] as const;

export const bestSellers = [
  { name: "Velvet Amber", brand: "ScentFlow", sold: 84, revenue: 4200 },
  { name: "Citrus Noir", brand: "ScentFlow", sold: 63, revenue: 3150 },
  { name: "Rose Oud", brand: "Maison Aura", sold: 52, revenue: 3120 },
  { name: "Musk Linen", brand: "Atelier Mist", sold: 47, revenue: 2350 },
] as const;

export const recentOrders = [
  { id: "SF-1042", customer: "Ava Nguyen", total: 120, status: "PACKING" },
  { id: "SF-1041", customer: "Liam Patel", total: 86, status: "PENDING" },
  { id: "SF-1040", customer: "Mia Tran", total: 240, status: "SHIPPING" },
  { id: "SF-1039", customer: "Noah Kim", total: 58, status: "COMPLETED" },
] as const;

