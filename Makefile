# FILE=VERSION
# VERSION='cat $(FILE)'

.PHONY: build immap package release

build:
	npm run dist

immap: build
	npm run immap:deploy

package: immap
	python setup.py sdist

# release: package
	# twine upload dist/isdc-geopanel-$(VERSION).tar.gz
