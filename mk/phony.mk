.PHONY: all clean test git-ok surge upload setup deploy

all: \
	src/google827af1fbb442e5a9.html \
	$(patsubst %.pug,%.html,$(shell find src ! -path "*base*" -name "*.pug"))

clean:
	find src \( -name "*.html" -o -name "*.css" -o -name "*.js" \) -delete

test:
	http-server src & \
	trap "kill $$!; exit" INT; \
	open -g "http://localhost:8080" & \
	while true; do find src | entr -cd $(MAKE) || [ $$? -eq 2 ]; done

git-ok:
	[ -z "$$(git status --porcelain)" ]
	[ "$$(git rev-parse --abbrev-ref @)" = master ]

surge:
	grep -q "surge.sh" ~/.netrc || surge login

upload:
	git push origin master
	surge -d azdavis.xyz -p src

setup: .git/hooks/pre-commit node_modules $(BINARY) surge

deploy: setup git-ok all upload
