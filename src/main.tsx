import { index } from "./pages/index";
import { page } from "./page";
import { Post } from "./post";
import { promises as fs } from "fs";
import glob from "fast-glob";
import matter from "gray-matter";
import mkdirp from "mkdirp";
import path from "path";
import { error404 } from "./pages/404";
import { ja } from "./pages/ja";
import { profiles } from "./pages/profiles";
import { resume } from "./pages/resume";

const rootDir = "build";
const postsDir = "posts";

async function writeHtml(
  dir: string,
  contents: string,
  file: string = "index.html",
) {
  await mkdirp(path.join(rootDir, dir));
  await fs.writeFile(
    path.join(rootDir, dir, file),
    "<!DOCTYPE html>" + contents,
  );
}

interface PostData {
  title: string;
  date: Date;
  slug: string;
}

async function mkPost(entry: string): Promise<PostData> {
  const { data, content } = matter((await fs.readFile(entry)).toString());
  const { title, date } = data;
  if (typeof title !== "string" || !(date instanceof Date)) {
    throw new Error("bad types");
  }
  const slug = path.basename(entry, ".md");
  await writeHtml(
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
  await fs.copyFile(p, path.join(rootDir, path.basename(p)));
}

async function main() {
  await fs.rm(rootDir, { recursive: true, force: true });
  await mkdirp(rootDir);
  await fs.copyFile(
    "node_modules/katex/dist/katex.min.css",
    path.join(rootDir, "katex.css"),
  );
  await Promise.all((await glob("static/*")).map(copyStatic));
  const entries = await Promise.all((await glob("posts/*.md")).map(mkPost));
  entries.sort(postCmp);
  const content = entries
    .map(({ title, slug }) => `- [${title}](/posts/${slug})`)
    .join("\n");
  await writeHtml(".", page(error404), "404.html");
  await writeHtml(".", page(index));
  await writeHtml("ja", page(ja));
  await writeHtml("profiles", page(profiles));
  await writeHtml("resume", page(resume));
  await writeHtml(
    postsDir,
    page({
      lang: "en",
      title: "Posts",
      styles: ["base"],
      body: <Post title="Posts" content={content} />,
    }),
  );
}

main().catch(console.error);
