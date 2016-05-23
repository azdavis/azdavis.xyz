Q = &> /dev/null

all: index.html 404.html

%.html: %.pug %.css
	pug $<

%.css: %.styl
	stylus --use 'autoprefixer-stylus' --compress $<

clean:
	find . \( -name '*.html' -o -name '*.css' \) -delete

server:
	@open http://localhost:8080
	@ruby -run -e httpd $(Q)

deploy: all
	surge .

.PHONY: all clean server deploy
