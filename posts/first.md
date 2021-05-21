---
title: First post
date: 2021-03-24
lang: en
---

This is the first post. It's basically just testing that the thing I hacked
together to render Markdown documents into HTML pages with code syntax
highlighting and $\KaTeX$ support is working.

```rust
fn main() {
  println!("Hello, world!");
  let date = vec![2021, 03, 24];
  let posted = true;
  if posted {
    println!("The date is {:?}", date);
  }
}
```

Here's some inline math: $a^2 + b^2 = c^2$ is the Pythagorean theorem. You could
rephrase it as $c = \sqrt{a^2 + b^2}$.

Here's some block math:

$$
\frac
  {\Gamma, x : \tau \vdash e : \rho}
  {\Gamma \vdash \lambda (x : \tau) e : \tau \rightarrow \rho}
$$