"use client";

import { useEffect, useState } from "react";
import type { Feedback, Origin, Post, Status } from "@/lib/types";
import { getNextPost } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { ChoiceButtons } from "@/components/ChoiceButtons";
import { FeedbackBanner } from "@/components/FeedbackBanner";

export default function Home() {
  const [post, setPost] = useState<Post | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [selected, setSelected] = useState<Origin | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);

  async function loadPost() {
    setSelected(null);
    setFeedback(null);
    setStatus("loading");
    try {
      const next = await getNextPost();
      setPost(next);
      setStatus("answering");
    } catch {
      setStatus("error");
    }
  }

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const next = await getNextPost();
        if (!cancelled) {
          setPost(next);
          setStatus("answering");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }
    init();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleSelect(origin: Origin) {
    if (!post || status !== "answering") return;
    setSelected(origin);
    setFeedback(origin === post.origin ? "correct" : "wrong");
    setStatus("answered");
  }

  const scene = feedback === "correct" ? "correct" : feedback === "wrong" ? "wrong" : "idle";

  const greenOn = scene === "correct";
  const redOn = scene === "wrong";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0c0b11] px-6 py-16">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="radial-base absolute inset-0 opacity-[0.2]" />
        <div
          className={`radial-correct absolute inset-0 transition-opacity duration-700 ease-out ${greenOn ? "opacity-[0.2]" : "opacity-0"}`}
        />
        <div
          className={`radial-wrong absolute inset-0 transition-opacity duration-700 ease-out ${redOn ? "opacity-[0.2]" : "opacity-0"}`}
        />
      </div>
      <div className="relative w-full max-w-xl">
        {status === "loading" && (
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/70" />
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-white/70">Não foi possível carregar a postagem.</p>
            <button
              type="button"
              onClick={loadPost}
              className="rounded-xl bg-white/10 px-5 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/15"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {post && (status === "answering" || status === "answered") && (
          <div className="flex flex-col gap-8">
            <PostCard post={post} />
            <ChoiceButtons
              status={status}
              selected={selected}
              correct={post.origin}
              onSelect={handleSelect}
            />
            <FeedbackBanner
              feedback={feedback}
              correct={post.origin}
              onContinue={loadPost}
            />
          </div>
        )}
      </div>
    </main>
  );
}