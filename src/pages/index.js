import React from "react"
import Link from "gatsby-link"
import Helmet from "react-helmet"
import css from "./index.module.css"

const H1 = ({children}) =>
	<h1 className={css.H1}>{children}</h1>

const H2 = ({children}) =>
	<h2 className={css.H2}>{children}</h2>

const Div = ({children}) =>
	<div className={css.Div}>{children}</div>

export default () => <div>
	<Helmet title="man azdavis"/>
	<H1>NAME</H1>
	<Div>azdavis - a fella</Div>
	<H2>SYNOPSIS</H2>
	<Div><code>
		azdavis (
			<Link to="resume/">resume</Link> {"| "}
			<Link to="posts/">posts</Link> {"| "}
			<Link to="projects/">projects</Link>
		)
	</code></Div>
	<H2>DESCRIPTION</H2>
	<Div>
		azdavis is pursuing a major in computer science, with a minor in
		Japanese studies, from Carnegie Mellon University.
	</Div>
	<H2>AUTHORS</H2>
	<Div>Written by David and Karen Davis.</Div>
	<H2>COPYRIGHT</H2>
	<Div>Copyright 1998 Ariel Davis.</Div>
</div>
