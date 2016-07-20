PATH := node_modules/.bin:$(PATH)
SHELL := sh -euo pipefail
Q ?= &> /dev/null
MAKEFLAGS += -s

.PHONY: all clean deploy git-ok upload setup hooks npm-i surge test get-binary
.PRECIOUS: %.css %.js

include deps.mak

%.html: %.pug src/base/head.pug %.css %.js
	echo $@
	pug -sb . --doctype html $<
	tr "\n" " " < $@ > $@.html
	mv $@.html $@

%.css: %.styl src/base/const.styl
	echo $@
	stylint -c lint/styl.json $?
	stylus -u autoprefixer-stylus -c $< $(Q)

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
	find src \( -name \*.html -o -name \*.css -o -name \*.js \) -delete

deploy: git-ok all upload

git-ok:
	[[ -z "$$(git status --porcelain)" ]]
	[[ "$$(git rev-parse --abbrev-ref @)" == master ]]

upload:
	git push -q origin master
	surge -d azdavis.xyz -p src 2> /dev/null \
		| grep size \
		| sed -E "s/^$$(printf "\033")\[90m +//g"

setup: hooks npm-i surge

hooks:
	mkdir -p .git/hooks
	rm -f .git/hooks/*.sample
	for f in hooks/*; do \
		[[ -h "$$f" ]] && rm "$$f"; \
		ln -fs "../../$$f" .git/hooks; \
	done

npm-i:
	npm i

surge:
	if ! grep -q surge.sh ~/.netrc; then surge login; fi

test:
	"util/test"

get-binary:
	"util/get-binary"
