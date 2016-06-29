SHELL := sh -euo pipefail
MAKEFLAGS += -s

.PHONY: all clean deploy git-ok npm-i-g
.PRECIOUS: %.css %.js

all: \
	404.html \
	index.html \
	lgw/index.html
lgw/index.js: \
	lgw/bullet.ts \
	lgw/canvas.ts \
	lgw/enemy.ts \
	lgw/game.ts \
	lgw/player.ts \
	lgw/sprite.ts

%.html: %.pug base/head.pug %.css %.js
	echo $@
	pug -sb . --doctype html $<
	tr "\n" " " < $@ > $@.html
	mv $@.html $@

%.css: %.styl base/variables.styl
	echo $@
	stylus -u autoprefixer-stylus -c $< &> /dev/null

%.js: %.ts
	echo $@
	tsc --removeComments $<
	if grep -qE "require\(" $@; then \
		browserify -o $@.js $@; \
		mv $@.js $@; \
	fi
	uglifyjs --screw-ie8 -cemo $@ $@ &> /dev/null

clean:
	find . \( -name "*.html" -o -name "*.css" -o -name "*.js" \) -delete

deploy: git-ok all
	git push -q origin master
	surge . 2> /dev/null | grep size

git-ok:
	[[ -z "$$(git status --porcelain)" ]]
	[[ "$$(git rev-parse --abbrev-ref @)" == master ]]

npm-i-g:
	npm i -g \
		autoprefixer-stylus \
		browserify \
		node-static \
		pug-cli \
		stylus \
		surge \
		tslint \
		typescript \
		uglifyjs
