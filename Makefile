MOCHA_OPTS= --check-leaks
REPORTER = dot

check: test

test: test-unit

test-unit:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		$(MOCHA_OPTS)

test-cov: lib-cov
	@ESECURITY_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov:
	jscoverage lib lib-cov
	
docs: test-docs

test-docs:
	make test REPORTER=doc \
		| cat docs/header.html - docs/footer.html \
		> docs/test.html

clean:
	rm -f coverage.html
	rm -fr lib-cov

.PHONY: test test-unit clean
