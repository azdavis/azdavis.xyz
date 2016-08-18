MAKEFLAGS += -rRs
SHELL := sh -euo pipefail
PATH := node_modules/.bin:$(PATH)
Q ?= &> /dev/null

.PHONY: all clean test deploy git-ok upload setup hooks npm binary surge
.PRECIOUS: %.css %.js

all: \
	$(patsubst %.pug, %.html, \
	$(shell find src -not -path "*base*" -name "*.pug"))
src/cbg/index.js: $(wildcard src/cbg/*.ts)
src/lgw/index.js: $(wildcard src/lgw/*.ts)
src/rut/index.js: $(wildcard src/rut/*.ts)

%.html: %.pug src/base/head.pug %.css %.js
	echo $@
	pug -sb . --doctype html $<
	tr "\n" " " < $@ > $@.html
	mv $@.html $@

%.css: %.styl src/base/var.styl
	echo $@
	stylint -c lint/styl.json $?
	BROWSERSLIST="> 0.1%" stylus -u autoprefixer-stylus -c $< $(Q)

%.js: %.ts
	echo $@
	tslint -c lint/ts.json $?
	tsc --noEmitOnError --removeComments $<
	if grep -q require\( $@; then \
		browserify -o $@.js $@; \
		mv $@.js $@; \
	fi
	uglifyjs --screw-ie8 -cemo $@ $@ $(Q)

clean:
	find src \( -name "*.html" -o -name "*.css" -o -name "*.js" \) -delete

test:
	http-server src &> /dev/null & \
	trap "kill $$!; printf ' server stopped'; exit" INT; \
	sleep 0.5 && open "http://localhost:8080" & \
	while true; do find . \
		-not -path "*.git*" \
		-a -not -path "*node_modules*" \
		| entr -d $(MAKE) || [[ $? == 2 ]]; \
	done

deploy: git-ok all upload

git-ok:
	[[ -z "$$(git status --porcelain)" ]]
	[[ "$$(git rev-parse --abbrev-ref @)" == master ]]

upload:
	git push -q origin master
	mv src/404/index.html src/404.html
	surge -d azdavis.xyz -p src 2> /dev/null \
		| grep size \
		| sed -E "s/^$$(printf "\033")\[90m +//g"
	mv src/404.html src/404/index.html

setup: hooks npm binary surge

hooks:
	mkdir -p .git/hooks
	rm -f .git/hooks/*.sample
	echo "make" > .git/hooks/pre-commit
	echo "make clean" > .git/hooks/post-checkout
	chmod +x .git/hooks/pre-commit .git/hooks/post-checkout

npm:
	npm i

binary:
	for x in \
		base/favicon.png \
		base/touch-icon.png \
		rut/a.mp3 \
		rut/ci.png \
	; do echo "$$x"; curl -fL "http://azdavis.xyz/$$x" > "src/$$x"; done

surge:
	if ! grep -q surge.sh ~/.netrc; then surge login; fi
