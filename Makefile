SJS_SRC := $(wildcard src/*.sjs) $(wildcard src/**/*.sjs)
LIB := $(patsubst src/%.sjs,lib/%.js,$(SJS_SRC))

SJS := ./node_modules/.bin/sjs -m algebraic-data-traits/macros -m rustyscript/macros -m adt/macros -m sparkler/macros
REGENERATOR := ./node_modules/.bin/regenerator

all: node_modules $(LIB)

node_modules:
	npm install

lib/%.js: src/%.sjs
	@echo "$< > $@"
	@mkdir -p $(@D)
	@$(SJS) -o $(@F)_ $<
	@$(REGENERATOR) $(@F)_ > $@
	@rm $(@F)_
