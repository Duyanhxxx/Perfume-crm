import { Menu, Search } from "lucide-react";

import { NotificationsMenu } from "@/components/app/notifications-menu";
import { Sidebar } from "@/components/app/sidebar";
import { ThemeToggle } from "@/components/app/theme-toggle";
import { UserMenu } from "@/components/app/user-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { requireAuth } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid min-h-screen max-w-screen-2xl grid-cols-1 lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-border bg-[rgba(42,42,42,0.7)] backdrop-blur-xl lg:block">
          <Sidebar />
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-20 border-b border-border bg-[rgba(19,19,19,0.6)] backdrop-blur-xl">
            <div className="flex h-14 items-center justify-between gap-3 px-4 lg:px-6">
              <div className="flex items-center gap-2 lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" aria-label="Open menu">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0">
                    <Sidebar />
                  </SheetContent>
                </Sheet>
              </div>

              <div className="hidden flex-1 lg:flex">
                <div className="relative w-full max-w-xl">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search orders, customers, or items…"
                    className="h-10 rounded-full border-border bg-secondary/40 pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <NotificationsMenu />
                <ThemeToggle />
                <UserMenu email={user.email} />
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
