.PHONY: all docs clean

all: docs

docs:
	python build.py

clean:
	-rm -rf docs/*
