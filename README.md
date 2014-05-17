# esecurity [![Build Status](https://secure.travis-ci.org/math-nao/esecurity.png)](http://travis-ci.org/math-nao/esecurity) [![NPM version](https://badge.fury.io/js/esecurity.svg)](http://badge.fury.io/js/esecurity)

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
origin | String | This parameter specifies a URI that may access the resource.<div>Default to `*`.</div>
credentials | Boolean | Indicates whether or not the response to the request can be exposed when the credentials flag is true.<div>Default to `false`.</div>
methods | Array | Specifies the method or methods allowed when accessing the resource.<div>Default to `['GET', 'PUT', 'POST', 'DELETE']`</div>
headers | Array | Used in response to a preflight request to indicate which HTTP headers can be used when making the actual request.<div>Default to `['Origin', 'X-Requested-With', 'Content-Type', 'Accept']`.</div>
exposeHeaders | String | This parameter lets a server whitelist headers that browsers are allowed to access.<div>Default to `false`.</div>
maxAge | Number | Specify how long the results of a preflight request can be cached.<div>Default to `0`.</div>


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
blockMode | Boolean | Specify whether or not render only `#` in IE instead of attempting to sanitize the page to surgically remove the XSS attack.<div>Default to `true`.</div>


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
maxAge | Number | Set the number of seconds, after the reception of the STS header field, during which the UA regards the host (from whom the message was received) as a Known HSTS Host.<div>Default to one year (365 * 24 * 60 * 60).</div>
includeSudomains | Boolean | Optional directive specifying that this HSTS Policy also applies to any hosts whose domain names are subdomains of the Known HSTS Host's domain name.<div>Default to `false`.</div>


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


### AngularXsrf
XSRF is a technique by which an unauthorized site can gain your user's private data. Angular provides a mechanism to counter XSRF.

``` js
    var esecurity = require('esecurity');
    var express = require('express');

    var app = express();

    app.use(express.cookieParser());
    app.use(express.session({ secret: 'esecurity example' }));
    app.use(express.bodyParser());

    app.use(esecurity.angularXsrf({
        cookie: {
            path: '/',
            secure: false
        }
    }));

    app.use(function(req, res){
        res.end('Hello world.');
    });

    app.listen(9898);
```

__Options__

`esecurity.angularXsrf([options])`
 
Name | Value | Description
------ | ----- | -----------
skip | Function, Boolean | Optional directive skipping angularXsrf module if function return `true`. Default to `function(req, res) {};`.
cookie | Number | Optional. Specify cookie options used in <a href="http://expressjs.com/api.html#res.cookie" target="_blank">res.cookie</a>.

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
headers | Array | Specify which headers name to add Content-Security-Policy (standard) and/or X-Content-Security-Policy, X-Webkit-CSP (experimental). Possible values are ["standard", "experimental"].<div>Default to `standard`.</div>
rules_secure | Boolean | Specify whether or not use predefined secure directive rules.<div>Default to `true`.</div>
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
reportOnly | Boolean | indicating whether or not use Content-Security-Policy-Report-Only header field. The Content-Security-Policy-Report-Only header field lets servers experiment with policies by monitoring (rather than enforcing) a policy.<div>Default to `false`.<div>
reportFilename | String | Filename where to write report data.<div>Default to `/tmp/esecurity_cspreport`</div>
onReport | Function (msg) | Use to write report data.<div>Default to `function (data) {...}`</div>


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
deny | Boolean | Specify whether or not use `DENY` x-frame-option.<div>Default to true.</div>
sameOrigin | Boolean | Specify whether or not use `SAMEORIGIN` x-frame-option.<div>Default to `false`.</div>
allowFrom | String | Specify origin to use in `ALLOW-FROM` x-frame-option.<div>Default is empty.</div>
jsUrl | String | Specify URI to load javascript file containing clickjacking protection.<div>Default to `clickjacking_protection.js`</div>


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
rate | Number | Specify the rate limit ceiling.<div>Default to `100`.</div>
window | Number | Specify the time window in seconds.<div>Default to `5`.</div>
delayGc | Number | Specify the delay in seconds before garbage collector is launched.<div>Default to `20`.</div>
keyZone | Function (req) | Returns name of the zone to catch.<div>Default to `function(req) { return req.ip; };`</div>
log | Function (msg) | Log denied requests.<div>Default is to not log.</div>


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
rate | Number | Specify the rate limit ceiling.<div>Default to `100`.</div>
window | Number | Specify the time window in minutes.<div>Default to `15`.</div>
enableHeaders | Boolean | Enable response headers (`X-Rate-Limit-Limit`, `X-Rate-Limit-Remaining`, `X-Rate-Limit-Reset`).<div>Default to `false`.</div><div>With:<div>- `X-Rate-Limit-Limit`: the rate limit ceiling for that given request</div><div>- `X-Rate-Limit-Remaining`: the number of requests left for the N minute window</div><div>- `X-Rate-Limit-Reset`: the remaining window before the rate limit resets in UTC epoch seconds</div></div>


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


