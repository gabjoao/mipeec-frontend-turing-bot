import { PrismaClient } from "@prisma/client";
import type { Origin, Post } from "./types";

declare global {
  // eslint-disable-next-line no-var
  var __mipeecPrisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.__mipeecPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__mipeecPrisma = prisma;
}

function mapDbOrigemToOrigin(origem: string): Origin {
  // turing-bot/bd/schema.sql: origem IN ('bluesky','mastodon','modelo_ia')
  // modelo_ia => ia, demais => real (quando vier dados de IA, já funciona)
  return origem === "modelo_ia" ? "ia" : "real";
}

function mapRowToPost(row: {
  id: number;
  texto: string;
  origem: string;
}): Post {
  return {
    id: String(row.id),
    author: "@Usuário",
    handle: "@usuario",
    text: row.texto,
    origin: mapDbOrigemToOrigin(row.origem),
  };
}

// ---------------------------------------------------------------------------
// Camada de acesso — expõe SÓ a tabela `postagens`.
// Nenhuma função aqui toca em `postagens_candidatas`.
// ---------------------------------------------------------------------------

export async function getRandomPost(): Promise<Post> {
  const count = await prisma.postagens.count();

  if (count === 0) {
    throw new Error("Nenhuma postagem encontrada em 'postagens'");
  }

  const skip = Math.floor(Math.random() * count);

  const [row] = await prisma.postagens.findMany({
    skip,
    take: 1,
    orderBy: { id: "asc" },
    select: { id: true, texto: true, origem: true },
  });

  if (!row) {
    throw new Error("Falha ao sortear postagem");
  }

  return mapRowToPost(row);
}

export async function getPostById(id: number): Promise<Post | null> {
  const row = await prisma.postagens.findUnique({
    where: { id },
    select: { id: true, texto: true, origem: true },
  });

  return row ? mapRowToPost(row) : null;
}

export async function getPostCount(): Promise<number> {
  return prisma.postagens.count();
}
