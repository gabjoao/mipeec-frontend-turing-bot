export type Origin = "ia" | "real";

export interface Post {
  id: string;
  author: string;
  handle: string;
  text: string;
  origin: Origin;
}

export type Feedback = "correct" | "wrong" | null;

export type Status = "loading" | "answering" | "answered" | "error";