Q = &>/dev/null

all: 404.html index.html game/index.html
404.html: 404.css
index.html: index.css index.js
game/index.html: game/index.css game/index.js
game/index.js: \
	game/sprite.ts \
	game/enemy.ts \
	game/player.ts \
	game/bullet.ts \
	game/canvas.ts \
	game/game.ts

%.html: %.pug base/head.pug
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
	@$(MAKE) all
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
