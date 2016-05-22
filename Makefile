Q = &> /dev/null

%.html: %.pug %.css
	pug $<

%.css: %.styl
	stylus --use 'autoprefixer-stylus' --compress $<

clean:
	find . \( -name '*.html' -o -name '*.css' \) -delete

server:
	@ruby -run -e httpd $(Q)

.PHONY: clean server
