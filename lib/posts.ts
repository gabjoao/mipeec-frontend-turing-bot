"use server";

import { getRandomPost } from "./db";
import type { Post } from "./types";

// Mantém a mesma assinatura que o front (app/page.tsx) já consome.
// Antes: round-robin em array mockado. Agora: sorteio real em `postagens` via lib/db.ts.
// Server Action — pode ser importada por Client Component.
export async function getNextPost(): Promise<Post> {
  return getRandomPost();
}
