"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { navItems } from "@/components/app/nav";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg border border-primary/40 bg-accent" />
        <div className="leading-tight">
          <div className="font-serif text-base font-semibold tracking-tight">
            L’Atelier
          </div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            CRM Nước hoa
          </div>
        </div>
      </div>

      <nav className="grid gap-1">
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-secondary/60 text-foreground ring-1 ring-primary/30"
                  : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "absolute left-0 top-1/2 h-8 w-[2px] -translate-y-1/2 rounded-full bg-primary opacity-0",
                  active && "opacity-100",
                )}
              />
              <Icon className="h-4 w-4" />
              <span className="text-[13px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-lg border bg-card/50 p-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Ghi chú
        </div>
        <div className="mt-2 text-sm text-foreground/90">
          Giữ tồn kho gọn. Theo dõi VIP. Giao trong 24h.
        </div>
      </div>
    </div>
  );
}
