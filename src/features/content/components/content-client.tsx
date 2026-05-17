"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { deleteContentPostAction, upsertContentPostAction } from "@/features/content/actions";
import { upsertContentPostSchema, type UpsertContentPostInput } from "@/features/content/schemas";

type ContentRow = {
  id: string;
  platform: "TIKTOK" | "INSTAGRAM";
  status: "IDEA" | "SCRIPT" | "FILMING" | "EDITING" | "POSTED";
  title: string;
  idea: string | null;
  caption: string | null;
  scheduledAt: string | null;
  postedAt: string | null;
};

function selectClassName() {
  return cn(
    "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  );
}

export function ContentClient({ posts }: { posts: ContentRow[] }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ContentRow | null>(null);

  const form = useForm<UpsertContentPostInput>({
    resolver: zodResolver(upsertContentPostSchema),
    defaultValues: {
      platform: "TIKTOK",
      status: "IDEA",
      title: "",
      idea: "",
      caption: "",
      scheduledAt: "",
      postedAt: "",
    },
  });

  React.useEffect(() => {
    if (!open) return;
    if (editing) {
      form.reset({
        id: editing.id,
        platform: editing.platform,
        status: editing.status,
        title: editing.title,
        idea: editing.idea ?? "",
        caption: editing.caption ?? "",
        scheduledAt: editing.scheduledAt ?? "",
        postedAt: editing.postedAt ?? "",
      });
    } else {
      form.reset({
        platform: "TIKTOK",
        status: "IDEA",
        title: "",
        idea: "",
        caption: "",
        scheduledAt: "",
        postedAt: "",
      });
    }
  }, [open, editing, form]);

  const columns = React.useMemo(() => {
    const order: ContentRow["status"][] = ["IDEA", "SCRIPT", "FILMING", "EDITING", "POSTED"];
    const by = new Map(order.map((s) => [s, [] as ContentRow[]]));
    posts.forEach((p) => by.get(p.status)?.push(p));
    return order.map((s) => ({ status: s, items: by.get(s) ?? [] }));
  }, [posts]);

  const platformPill = (p: ContentRow["platform"]) => {
    if (p === "INSTAGRAM")
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-[linear-gradient(90deg,#ff4d4d,#ffb84d)] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-black">
          Instagram
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-secondary/60 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-foreground">
        TikTok
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) setEditing(null);
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              New Content Idea
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit post" : "New post"}</DialogTitle>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(async (values) => {
                const res = await upsertContentPostAction(values);
                if (res.ok) {
                  toast.success("Saved");
                  setOpen(false);
                  router.refresh();
                }
              })}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" {...form.register("title")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <select id="platform" className={selectClassName()} {...form.register("platform")}>
                    <option value="TIKTOK">TikTok</option>
                    <option value="INSTAGRAM">Instagram</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select id="status" className={selectClassName()} {...form.register("status")}>
                    <option value="IDEA">Idea</option>
                    <option value="SCRIPT">Script</option>
                    <option value="FILMING">Filming</option>
                    <option value="EDITING">Editing</option>
                    <option value="POSTED">Posted</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduledAt">Scheduled at</Label>
                  <Input id="scheduledAt" placeholder="2026-05-16T10:00:00Z" {...form.register("scheduledAt")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postedAt">Posted at</Label>
                  <Input id="postedAt" placeholder="2026-05-16T10:00:00Z" {...form.register("postedAt")} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="idea">Idea</Label>
                  <Textarea id="idea" {...form.register("idea")} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="caption">Caption</Label>
                  <Textarea id="caption" {...form.register("caption")} />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {columns.map((col) => (
          <div key={col.status} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {col.status}
                </div>
              </div>
              <div className="rounded-full bg-secondary/50 px-2 py-0.5 text-[11px] font-semibold text-foreground">
                {col.items.length}
              </div>
            </div>

            {col.items.length === 0 ? (
              <Card className="bg-card/40">
                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                  No items
                </CardContent>
              </Card>
            ) : (
              col.items.map((p) => (
                <Card key={p.id} className="bg-card/50">
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      {platformPill(p.platform)}
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Delete"
                        onClick={async () => {
                          if (!confirm("Delete this post?")) return;
                          await deleteContentPostAction({ id: p.id });
                          toast.success("Deleted");
                          router.refresh();
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-xl">{p.title}</CardTitle>
                    {p.idea ? (
                      <div className="text-sm text-muted-foreground">
                        {p.idea}
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setEditing(p);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        {p.status === "SCRIPT" ? "Drafting" : ""}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
