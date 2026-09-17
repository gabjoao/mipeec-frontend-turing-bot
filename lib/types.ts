export type Origin = "ia" | "real";

// Origem no BD: 'bluesky'|'mastodon' => 'real', 'modelo_ia' => 'ia' (mapeado em lib/db.ts)
// author/handle são sintéticos ("@Usuário") pois `postagens` só tem `texto`.
export interface Post {
  id: string;
  author: string;
  handle: string;
  text: string;
  origin: Origin;
}

export type Feedback = "correct" | "wrong" | null;

export type Status = "loading" | "answering" | "answered" | "error";