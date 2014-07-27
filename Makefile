MOCHA_OPTS= --require should --timeout 7000 --check-leaks --globals "setImmediate,clearImmediate"
REPORTER = dot

check: test

test: test-unit

test-unit:
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter $(REPORTER) $(MOCHA_OPTS)

test-cov: lib-cov
	@ESECURITY_COV=1 $(MAKE) test REPORTER=html-cov > docs/coverage.html

test-travis:
	@NODE_ENV=test node \
                node_modules/.bin/istanbul cover \
                ./node_modules/.bin/_mocha \
                -- -u exports \
                $(MOCHA_OPTS) \
                --bail

lib-cov:
	jscoverage lib lib-cov
	
docs: test-docs

test-docs:
	make test REPORTER=doc | cat docs/fragments/header.html - docs/fragments/footer.html > docs/test.html

clean:
	rm -f coverage.html
	rm -rf lib-cov

.PHONY: test test-unit docs clean
