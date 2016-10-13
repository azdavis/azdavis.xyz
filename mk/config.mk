MAKEFLAGS += -rRs
SHELL = PATH=node_modules/.bin:$(PATH) sh
Q = &> /dev/null
BINARY = src/favicon.png src/touch_icon.png src/rut/a.mp3 src/rut/ci.png

.PHONY: all clean test git-ok surge upload setup deploy
.PRECIOUS: %.html %.css %.js