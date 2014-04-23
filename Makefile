SJS_SRC := $(wildcard src/*.sjs) $(wildcard src/**/*.sjs)
LIB := $(patsubst src/%.sjs,lib/%.js,$(SJS_SRC))

CMD := ./node_modules/.bin/sjs -m algebraic-data-traits/macros -m rustyscript/macros -m adt/macros -m sparkler/macros

all: node_modules $(LIB)

node_modules:
	npm install

lib/%.js: src/%.sjs
	@mkdir -p $(@D)
	@echo "$< > $@"
	@$(CMD) -o $@ $<
