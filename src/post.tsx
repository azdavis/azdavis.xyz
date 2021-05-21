import { ReactElement } from "react";
import { Remarkable } from "remarkable";
import { DateShow } from "./date-show";
import hl from "highlight.js";
import katex from "remarkable-katex";
import lean from "highlightjs-lean";

interface Props {
  title: string;
  content: string;
  date: Date;
  lang: string;
}

hl.registerLanguage("lean", lean);

function highlight(code: string, language: string): string {
  return hl.getLanguage(language) ? hl.highlight(code, { language }).value : "";
}

const markdown = new Remarkable({ highlight });
markdown.use(katex);

export function Post({ title, content, date, lang }: Props): ReactElement {
  return (
    <>
      <div>
        <a href="/">azdavis.xyz</a> • <DateShow lang={lang} date={date} />
      </div>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: markdown.render(content) }} />
    </>
  );
}