import type { Post } from "@/lib/types";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="flex flex-col gap-6">
      <header className="flex items-center gap-3">
        <div
          aria-hidden
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-medium text-white/60"
        >
          {post.author.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-medium text-white/90">{post.author}</span>
          <span className="text-sm text-white/40">{post.handle}</span>
        </div>
      </header>
      <p className="text-pretty text-base leading-relaxed text-white/80">
        {post.text}
      </p>
    </article>
  );
}