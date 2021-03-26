import { index } from "./pages/index";
import { page } from "./page";
import { Post } from "./post";
import { promisify } from "util";
import fs from "fs";
import glob from "fast-glob";
import matter from "gray-matter";
import mkdirp from "mkdirp";
import path from "path";
import { error404 } from "./pages/404";
import { ja } from "./pages/ja";
import { profiles } from "./pages/profiles";
import { resume } from "./pages/resume";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const rm = promisify(fs.rm);
const copyFile = promisify(fs.copyFile);

const rootDir = "build";
const postsDir = "posts";

async function writeIndex(dir: string, contents: string) {
  await mkdirp(path.join(rootDir, dir));
  await writeFile(path.join(rootDir, dir, "index.html"), contents);
}

interface PostData {
  title: string;
  date: Date;
  slug: string;
}

async function mkPost(entry: string): Promise<PostData> {
  const { data, content } = matter((await readFile(entry)).toString());
  const { title, date } = data;
  if (typeof title !== "string" || !(date instanceof Date)) {
    throw new Error("bad types");
  }
  const slug = path.basename(entry, ".md");
  await writeIndex(
    path.join(postsDir, slug),
    page({
      lang: "en",
      title,
      styles: ["base", "code", "katex"],
      body: <Post title={title} content={content} />,
    }),
  );
  return { title, date, slug };
}

function postCmp({ date: a }: PostData, { date: b }: PostData): number {
  return a === b ? 0 : a < b ? 1 : -1;
}

async function copyStatic(p: string) {
  await copyFile(p, path.join(rootDir, path.basename(p)));
}

async function main() {
  await rm(rootDir, { recursive: true, force: true });
  await mkdirp(rootDir);
  await copyFile(
    "node_modules/katex/dist/katex.min.css",
    path.join(rootDir, "katex.css"),
  );
  await Promise.all((await glob("static/*")).map(copyStatic));
  const entries = await Promise.all((await glob("posts/*.md")).map(mkPost));
  entries.sort(postCmp);
  const content = entries
    .map(({ title, slug }) => `- [${title}](/posts/${slug})`)
    .join("\n");
  await writeFile(path.join(rootDir, "404.html"), page(error404));
  await writeIndex(".", page(index));
  await writeIndex("ja", page(ja));
  await writeIndex("profiles", page(profiles));
  await writeIndex("resume", page(resume));
  await writeIndex(
    postsDir,
    page({
      lang: "en",
      title: "All posts",
      styles: ["base"],
      body: <Post title="All posts" content={content} />,
    }),
  );
}

main().catch(console.error);
