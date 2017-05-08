MOCHA_OPTS= --require should --timeout 7000 --check-leaks --globals "setImmediate,clearImmediate"
REPORTER = dot

check: test

test: test-cov

test-unit:
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter $(REPORTER) $(MOCHA_OPTS)

test-travis: test-cov

test-cov:
	@NODE_ENV=test node \
                node_modules/.bin/istanbul cover \
                ./node_modules/.bin/_mocha \
                -- -u exports \
                $(MOCHA_OPTS) \
                --bail
	
docs: test-docs

test-docs:
	make test REPORTER=doc | cat docs/fragments/header.html - docs/fragments/footer.html > docs/test.html

clean:
	rm -f coverage.html
	rm -rf lib-cov

.PHONY: test test-unit docs clean
