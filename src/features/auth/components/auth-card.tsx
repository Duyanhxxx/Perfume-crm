import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthCard(props: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <Link href="/login" className="text-sm font-semibold tracking-tight">
            ScentFlow
          </Link>
        </div>
        <div className="space-y-1">
          <CardTitle>{props.title}</CardTitle>
          {props.subtitle ? (
            <p className="text-sm text-muted-foreground">{props.subtitle}</p>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {props.children}
        {props.footer ? <div className="text-sm">{props.footer}</div> : null}
      </CardContent>
    </Card>
  );
}

