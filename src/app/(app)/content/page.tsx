import { ContentClient } from "@/features/content/components/content-client";
import { listContentPosts } from "@/features/content/queries";

export default async function ContentPage() {
  const raw = await listContentPosts();
  type Row = Awaited<ReturnType<typeof listContentPosts>>[number];
  const posts = raw.map((p: Row) => ({
    id: p.id,
    platform: p.platform,
    status: p.status,
    title: p.title,
    idea: p.idea,
    caption: p.caption,
    scheduledAt: p.scheduledAt ? p.scheduledAt.toISOString() : null,
    postedAt: p.postedAt ? p.postedAt.toISOString() : null,
  }));

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-serif text-4xl font-semibold tracking-tight">
          Kế hoạch nội dung
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Tổ chức và theo dõi nội dung trên TikTok, Instagram và YouTube Shorts.
        </p>
      </div>

      <ContentClient posts={posts} />
    </div>
  );
}
