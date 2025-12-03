HUGO ?= hugo
HUGO_FLAGS ?=

.PHONY: all serve clean build help

all: build

build: clean
	$(HUGO) $(HUGO_FLAGS)

serve:
	$(HUGO) server -D $(HUGO_FLAGS)

clean:
	-rm -rf public/*

help:
	@echo "Available targets:"
	@echo "  build  - Build the site (default)"
	@echo "  serve  - Start development server"
	@echo "  clean  - Remove generated files"
