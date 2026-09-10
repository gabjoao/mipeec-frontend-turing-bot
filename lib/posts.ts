import type { Post } from "./types";

const posts: Post[] = [
  {
    id: "1",
    author: "Camila Rocha",
    handle: "@camilarocha",
    text: "Saí às seis da manhã pra bater na porta da padaria antes de abrir. O padeiro me deu um pão ainda quente de graça porque disse que meu sorriso salvou o dia dele. A gente nunca sabe o tamanho do que um gesto simples faz.",
    origin: "ia",
  },
  {
    id: "2",
    author: "Thiago Lima",
    handle: "@thiagolima",
    text: "gente alguém mais tá com esse calor absurdo?? meu ventilador tá girando faz uma semana sem parar e eu já nem sei mais o que é dormir direito kkkkk",
    origin: "real",
  },
  {
    id: "3",
    author: "Marina Prado",
    handle: "@marinaprado",
    text: "Empresas que constroem comunidades fortes colhem recompensas duradouras. Ao investir em conexões genuínas, o valor transcende a transação: lealdade, confiança e um senso compartilhado de propósito florescem organicamente.",
    origin: "ia",
  },
  {
    id: "4",
    author: "Diego Alves",
    handle: "@diegoalves",
    text: "hoje eu chorei assistindo o peixe nadar no aquário do meu sobrinho. não sei se é a semana cansativa ou se o peixe tava triste também.",
    origin: "real",
  },
  {
    id: "5",
    author: "Patrícia Souza",
    handle: "@patriciasouza",
    text: "A jornada de mil milhas começa com um único passo, e cada passo em direção aos seus sonhos é uma vitória silenciosa. Permaneça firme, pois a perseverança transforma obstáculos em degraus.",
    origin: "ia",
  },
];

let index = 0;

export async function getNextPost(): Promise<Post> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const post = posts[index % posts.length];
  index += 1;
  return post;
}