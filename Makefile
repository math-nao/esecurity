MOCHA_OPTS= --check-leaks --globals "setImmediate,clearImmediate"
REPORTER = dot

check: test

test: test-unit

test-unit:
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter $(REPORTER) $(MOCHA_OPTS)

test-cov: lib-cov
	@ESECURITY_COV=1 $(MAKE) test REPORTER=html-cov > docs/coverage.html

lib-cov:
	jscoverage lib lib-cov
	
docs: test-docs

test-docs:
	make test REPORTER=doc | cat docs/fragments/header.html - docs/fragments/footer.html > docs/test.html

clean:
	rm -f coverage.html
	rm -rf lib-cov

.PHONY: test test-unit docs clean
