Q = &>/dev/null

all: \
	404.html \
	index.html \
	lgm/index.html
404.html: \
	404.css
index.html: \
	index.css \
	index.js
lgm/index.html: \
	lgm/index.css \
	lgm/index.js
lgm/index.js: \
	lgm/sprite.ts \
	lgm/enemy.ts \
	lgm/player.ts \
	lgm/bullet.ts \
	lgm/canvas.ts \
	lgm/game.ts

%.html: %.pug include/head.pug
	pug -sb . --doctype 'html' $<

%.css: %.styl
	stylus -u 'autoprefixer-stylus' -c $< $(Q)

%.js: %.ts
	tsc --removeComments $<
	@grep -qE 'require\(' $@ && \
		echo 'browserify -o $@ $@' && \
		browserify -o $@.js $@ && \
		mv $@.js $@;:
	uglifyjs --screw-ie8 -cemo $@ $@ $(Q)

clean:
	find . \( -name '*.html' -o -name '*.css' -o -name '*.js' \) -delete

test:
	@open -g 'http://localhost:8080'
	@ruby -run -e httpd $(Q)

deploy:
	git checkout -q master
	@$(MAKE)
	git push -q origin master
	surge . $(Q)

npm-i-g:
	npm i -g \
		autoprefixer-stylus \
		browserify \
		npm \
		pug-cli \
		stylus \
		surge \
		tslint \
		typescript \
		uglifyjs

.PHONY: all clean test deploy npm-i-g
