.PHONY: all docs clean

all: clean docs

docs:
	python build.py

clean:
	-rm -rf docs/*
