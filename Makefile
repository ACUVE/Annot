TSC = tsc
TSS = js.ts nomod.ts module/Annot.ts
JSS = $(TSS:.ts=.js)
TSFLAGS = -t ES2017 --strict --sourcemap

.SUFFIXES: .ts .js

.PHONY: all
all: $(JSS)

.PHONY: clean
clean:
	$(RM) $(JSS)

.ts.js:
	$(TSC) $(TSFLAGS) $<
