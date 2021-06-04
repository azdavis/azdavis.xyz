import { error404 } from "./pages/404";
import { index } from "./pages/index";
import { ja } from "./pages/ja";
import { join, basename } from "path";
import { Lang } from "./lang";
import { page } from "./page";
import { Post } from "./post";
import { posts } from "./pages/posts";
import { promises as fs } from "fs";
import glob from "fast-glob";
import matter from "gray-matter";
import mkdirp from "mkdirp";

const rootDir = "build";
const postsDir = "posts";

// https://stackoverflow.com/a/64255382
async function copyDir(src: string, dest: string) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function writeHtml(
  dir: string,
  contents: string,
  file: string = "index.html",
) {
  await mkdirp(join(rootDir, dir));
  await fs.writeFile(join(rootDir, dir, file), "<!DOCTYPE html>" + contents);
}

interface PostData {
  title: string;
  date: Date;
  lang: Lang;
  content: string;
}

function getPostData(contents: string): PostData {
  const { data, content } = matter(contents);
  const { title, date, lang } = data;
  if (typeof title !== "string") {
    throw new Error("title must be a string");
  }
  if (!(date instanceof Date)) {
    throw new Error("date must be a Date");
  }
  if (typeof lang !== "string") {
    throw new Error("lang must be a string");
  }
  if (lang !== "en" && lang !== "ja") {
    throw new Error("lang must be en or ja");
  }
  return { title, date, lang, content };
}

interface PostListItem {
  title: string;
  date: Date;
  slug: string;
}

async function mkPost(entry: string): Promise<PostListItem> {
  const file = await fs.readFile(entry);
  const { title, date, lang, content } = getPostData(file.toString());
  const slug = basename(entry, ".md");
  const post = page({
    lang,
    title,
    styles: ["base", "code", "katex/katex.min"],
    body: <Post title={title} content={content} lang={lang} date={date} />,
  });
  await writeHtml(join(postsDir, slug), post);
  return { title, date, slug };
}

function sameTitle(x: string): never {
  throw new Error(`two posts have the same title: ${x}`);
}

function postCmp(a: PostListItem, b: PostListItem): -1 | 1 {
  return a.date === b.date
    ? a.title === b.title
      ? sameTitle(a.title)
      : a.title < b.title
      ? -1
      : 1
    : a.date < b.date
    ? 1
    : -1;
}

async function copyStatic(p: string) {
  await fs.copyFile(p, join(rootDir, basename(p)));
}

async function main() {
  await fs.rm(rootDir, { recursive: true, force: true });
  await mkdirp(rootDir);
  await copyDir("node_modules/katex/dist", join(rootDir, "katex"));
  await Promise.all((await glob("static/*")).map(copyStatic));
  const entries = await Promise.all((await glob("posts/*.md")).map(mkPost));
  entries.sort(postCmp);
  await writeHtml(".", page(error404), "404.html");
  await writeHtml(".", page(index));
  await writeHtml("ja", page(ja));
  await writeHtml(postsDir, page(posts(entries)));
}

main().catch(console.error);
