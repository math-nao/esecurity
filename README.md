# esecurity [![NPM version][npm-image]][npm-url] [![Build status][travis-image]][travis-url] [![Test coverage][coveralls-image]][coveralls-url] [![License][license-image]][license-url]

Security middlewares for express framework (xsrf, xss, clickjacking...).

## Installation

```
  npm install esecurity
```

## Middlewares

### CORS
Cross-site HTTP requests are HTTP requests for resources from a domain different of the resource making the request.

``` js
    var esecurity = require('esecurity');
    var express = require('express');

    var app = express();

    app.use(esecurity.cors({
        origin: '*',
        credentials: true,
        methods: ['POST'],
        headers: ['X-PINGOTHER'],
        exposeHeaders: ['X-PINGOTHER'],
        maxAge: 60
    }));

    app.use(function(req, res){
        res.end('Hello world.');
    });

    app.listen(9898);
```

__Options__

`esecurity.cors([options])`
 
Name | Value | Description
------ | ----- | -----------
origin | String | This parameter specifies a URI that may access the resource.<br />Default to `*`.
credentials | Boolean | Indicates whether or not the response to the request can be exposed when the credentials flag is true.<br />Default to `false`.
methods | Array | Specifies the method or methods allowed when accessing the resource.<br />Default to `['GET', 'PUT', 'POST', 'DELETE']`.
headers | Array | Used in response to a preflight request to indicate which HTTP headers can be used when making the actual request.<br />Default to `['Origin', 'X-Requested-With', 'Content-Type', 'Accept']`.
exposeHeaders | String | This parameter lets a server whitelist headers that browsers are allowed to access.<br />Default to `false`.
maxAge | Number | Specify how long the results of a preflight request can be cached.<br />Default to `0`.


### XSS
Cross-site scripting (XSS) attacks occur when one website, generally malicious, injects (adds) JavaScript code into otherwise legitimate requests to another website.

``` js
    var esecurity = require('esecurity');
    var express = require('express');

    var app = express();

    app.use(esecurity.xss());

    app.use(function(req, res){
        res.end('Hello world.');
    });

    app.listen(9898);
```

__Options__

`esecurity.xss([options])`
 
Name | Value | Description
------ | ----- | -----------
blockMode | Boolean | Specify whether or not render only `#` in IE instead of attempting to sanitize the page to surgically remove the XSS attack.<br />Default to `true`.


### HSTS
HTTP Strict Transport Security (HSTS) is a web security policy mechanism whereby a web server declares that complying user agents (such as a web browser) are to interact with it using only secure HTTPS connections (i.e. HTTP layered over TLS/SSL).

``` js
    var esecurity = require('esecurity');
    var express = require('express');

    var app = express();

    app.use(esecurity.hsts({
        maxAge: 60,
        includeSudomains: true
    }));

    app.use(function(req, res){
        res.end('Hello world.');
    });

    app.listen(9898);
```

__Options__

`esecurity.hsts([options])`
 
Name | Value | Description
------ | ----- | -----------
maxAge | Number | Set the number of seconds, after the reception of the STS header field, during which the UA regards the host (from whom the message was received) as a Known HSTS Host.<br />Default to `365 * 24 * 60 * 60` (one year).
includeSudomains | Boolean | Optional directive specifying that this HSTS Policy also applies to any hosts whose domain names are subdomains of the Known HSTS Host's domain name.<br />Default to `false`.


### MimeSniffing
MimeSniffing attempts to determine the content-type for each downloaded resource and therefore can have security issues.

``` js
    var esecurity = require('esecurity');
    var express = require('express');

    var app = express();

    app.use(esecurity.mimeSniffing());

    app.use(function(req, res){
        res.end('Hello world.');
    });

    app.listen(9898);
```

__Options__

    None


### XSRF
XSRF is a technique by which an unauthorized site can gain your user's private data.

``` js
    var esecurity = require('../..');
    var express = require('express');
    var cookieParser = require('cookie-parser');
    var expressSession = require('express-session');
    var bodyParser = require('body-parser');

    var app = express();

    app.use(cookieParser());

    app.use(expressSession({
        resave: false,
        saveUninitialized: false,
        secret: 'esecurity example'
    }));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(esecurity.xsrf({
        skip: function (req, res) {
            return /^\/noxsrf/i.test(req.url);
        },
        cookie: {
            path: '/',
            secure: false
        }
    }));

    app.get('/api/xsrf.json', function(req, res, next){
        res.json({ 'xsrf': req.xsrfToken() });
    });

    app.get('/', function(req, res, next){
        res.end('Hello world.');
    });

    app.listen(9898);
```

__Options__

`esecurity.xsrf([options])`
 
Name | Value | Description
------ | ----- | -----------
skip | Function, Boolean | Optional directive skipping angularXsrf module if function return `true`.<br />Default to `function(req, res) {};`.
cookieName | String | Optional.  Specify the cookie name. If empty, xsrf token will not be passed by cookie.<br />Default to an empty string.
angular | Boolean | Optional. Shortname for `cookiName: 'XSRF-TOKEN'` will support Angular xsrf handling.<br />Default to `false`.
cookie | Object | Optional. Specify cookie options used in <a href="http://expressjs.com/api.html#res.cookie" target="_blank">res.cookie</a>.<br />Default to `{}`.

### Content Security Policy (CSP)
Content Security Policy (CSP) is a computer security concept, to prevent cross-site scripting (XSS) and related attacks.

``` js
    var esecurity = require('esecurity');
    var express = require('express');

    var app = express();

    app.use(esecurity.csp({
        scriptSrc: ["self", "www.google-analytics.com"]
    }));

    app.use(function(req, res){
        res.end('Hello world.');
    });

    app.listen(9898);
```

__Options__

`esecurity.csp([options])`
 
Name | Value | Description
------ | ----- | -----------
headers | Array | Specify which headers name to add Content-Security-Policy (standard) and/or X-Content-Security-Policy, X-Webkit-CSP (experimental). Possible values are ["standard", "experimental"].<br />Default to `standard`.
rules_secure | Boolean | Specify whether or not use predefined secure directive rules.<br />Default to `true`.
defaultSrc | String | Refer to <a href="http://w3c.github.io/webappsec/specs/content-security-policy/csp-specification.dev.html#default-src" target="blank">default-src</a> directive.
scriptSrc | String | Refer to <a href="http://w3c.github.io/webappsec/specs/content-security-policy/csp-specification.dev.html#script-src" target="blank">script-src</a> directive.
objectSrc | String | Refer to <a href="http://w3c.github.io/webappsec/specs/content-security-policy/csp-specification.dev.html#object-src" target="blank">object-src</a> directive.
styleSrc | String | Refer to <a href="http://w3c.github.io/webappsec/specs/content-security-policy/csp-specification.dev.html#style-src" target="blank">style-src</a> directive.
imgSrc | String | Refer to <a href="http://w3c.github.io/webappsec/specs/content-security-policy/csp-specification.dev.html#img-src" target="blank">img-src</a> directive.
mediaSrc | String | Refer to <a href="http://w3c.github.io/webappsec/specs/content-security-policy/csp-specification.dev.html#media-src" target="blank">media-src</a> directive.
frameSrc | String | Refer to <a href="http://w3c.github.io/webappsec/specs/content-security-policy/csp-specification.dev.html#frame-src" target="blank">frame-src</a> directive.
fontSrc | String | Refer to <a href="http://w3c.github.io/webappsec/specs/content-security-policy/csp-specification.dev.html#font-src" target="blank">font-src</a> directive.
connectSrc | String | Refer to <a href="http://w3c.github.io/webappsec/specs/content-security-policy/csp-specification.dev.html#connect-src" target="blank">connect-src</a> directive.
sandbox | String | Refer to <a href="http://w3c.github.io/webappsec/specs/content-security-policy/csp-specification.dev.html#sandbox" target="blank">sandbox</a> directive.
reportUri | String | Refer to <a href="http://w3c.github.io/webappsec/specs/content-security-policy/csp-specification.dev.html#report-uri" target="blank">report-uri</a> directive.
reportOnly | Boolean | indicating whether or not use Content-Security-Policy-Report-Only header field. The Content-Security-Policy-Report-Only header field lets servers experiment with policies by monitoring (rather than enforcing) a policy.<br />Default to `false`.
reportFilename | String | Filename where to write report data.<br />Default to `/tmp/esecurity_cspreport`.
onReport | Function (msg) | Use to write report data.<br />Default to `function (data) {...}`.


### ClickJacking
Clickjacking (User Interface redress attack, UI redress attack, UI redressing) is a malicious technique of tricking a Web user into clicking on something different from what the user perceives they are clicking on, thus potentially revealing confidential information or taking control of their computer while clicking on seemingly innocuous web pages.

``` js
    var esecurity = require('esecurity');
    var express = require('express');

    var app = express();

    app.use(esecurity.clickJacking({
        sameOrigin: true
    }));

    app.use(function(req, res){
        if (!/\.js$/i.test(req.url)) 
            res.sendfile(__dirname + '/test.html');
    });

    app.listen(9898);
```
With test.html file:
``` html
    <!DOCTYPE html>
    <html>
        <head>
            <script src="clickjacking_protection.js"/>
        </head>
        <body>
            <pre>Hello world.</pre>
        </body>
    </html>
```

__Options__

`esecurity.clickJacking([options])`
 
Name | Value | Description
------ | ----- | -----------
deny | Boolean | Specify whether or not use `DENY` x-frame-option.<br />Default to `true`.
sameOrigin | Boolean | Specify whether or not use `SAMEORIGIN` x-frame-option.<br />Default to `false`.
allowFrom | String | Specify origin to use in `ALLOW-FROM` x-frame-option.<br />Default is empty.
jsUrl | String | Specify URI to load javascript file containing clickjacking protection.<br />Default to `clickjacking_protection.js`.


### ZoneLimit
This module helps you to limit requests according ip, cookie or anything else.

``` js
    var esecurity = require('esecurity');
    var express = require('express');

    var app = express();

    app.use(esecurity.zoneLimit({
        keyZone: function(req) {
            return req.ip;
        }
    }));

    app.use(function(req, res){
        res.end('Hello world.');
    });

    app.listen(9898);
```

__Options__

`esecurity.zoneLimit([options])`
 
Name | Value | Description
------ | ----- | -----------
rate | Number | Specify the rate limit ceiling.<br />Default to `100`.
window | Number | Specify the time window in seconds.<br />Default to `5`.
delayGc | Number | Specify the delay in seconds before garbage collector is launched.<br />Default to `20`.
keyZone | Function (req) | Returns name of the zone to catch.<br />Default to `function(req) { return req.ip; };`.
log | Function (msg) | Log denied requests.<br />Default is to not log.


### Rate
This module helps you to limit requests by session and by route. `X-Rate-Limit` headers can be sent to client.

``` js
    var esecurity = require('esecurity');
    var express = require('express');

    var app = express();

    app.use(express.cookieParser());
    app.use(express.session({ secret: 'SECRET_KEY' }));

    app.get('/', esecurity.rate({ rate: 2, window: 5, enableHeaders: true }), function(req, res, next) {
        res.end('Hello world.');
    });

    app.listen(9898);
```

__Options__

`esecurity.rate([options])`
 
Name | Value | Description
------ | ----- | -----------
rate | Number | Specify the rate limit ceiling.<br />Default to `100`.
window | Number | Specify the time window in minutes.<br />Default to `15`.
enableHeaders | Boolean | Enable response headers (`X-Rate-Limit-Limit`, `X-Rate-Limit-Remaining`, `X-Rate-Limit-Reset`).<br />Default to `false`.<br />With:<br />    - `X-Rate-Limit-Limit`: the rate limit ceiling for that given request<br />    - `X-Rate-Limit-Remaining`: the number of requests left for the N minute window<br />    - `X-Rate-Limit-Reset`: the remaining window before the rate limit resets in UTC epoch seconds


## Run Tests
Tests are given complete coverage of all features.

``` bash
  $ npm test
```


## Examples

To run examples, clone the Esecurity repo and install the example/test suite dependencies:

    $ git clone git://github.com/math-nao/esecurity.git --depth 1
    $ cd esecurity
    $ npm install

then run any example:

    $ node examples/cors


## License

MIT

[npm-image]: https://img.shields.io/npm/v/esecurity.svg?style=flat
[npm-url]: https://npmjs.org/package/esecurity
[travis-image]: https://img.shields.io/travis/math-nao/esecurity/2.0.0.svg?style=flat
[travis-url]: https://travis-ci.org/math-nao/esecurity
[coveralls-image]: https://img.shields.io/coveralls/math-nao/esecurity.svg?style=flat
[coveralls-url]: https://coveralls.io/r/math-nao/esecurity?branch=2.0.0
[license-image]: http://img.shields.io/npm/l/esecurity.svg?style=flat
[license-url]: https://github.com/math-nao/esecurity/blob/2.0.0/LICENSE

