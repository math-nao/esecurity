# esecurity [![Build Status](https://secure.travis-ci.org/math-nao/esecurity.png)](http://travis-ci.org/math-nao/esecurity)

Security middleware for express framework (xsrf, xss, clickjacking, ...).

## CORS
Cross-site HTTP requests are HTTP requests for resources from a different domain than the domain of the resource making the request.

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

Parameters:
origin: This parameter specifies a URI that may access the resource. Default to '*';
credentials: Indicates whether or not the response to the request can be exposed when the credentials flag is true. Default to false;
methods: Specifies the method or methods allowed when accessing the resource. Default to ['GET', 'PUT', 'POST', 'DELETE'];
headers: Used in response to a preflight request to indicate which HTTP headers can be used when making the actual request. Default to ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'];
exposeHeaders: This parameter lets a server whitelist headers that browsers are allowed to access. Default to false;
maxAge: Indicate how long the results of a preflight request can be cached. Default to 0;

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

Parameters:
blockMode: [true | false] Whether or not render only “#” in IE instead of attempting to sanitize the page to surgically remove the XSS attack. Default to true;

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

Parameters:
maxAge: required directive specifies the number of seconds, after the reception of the STS header field, during which the UA regards the host (from whom the message was received) as a Known HSTS Host. Default to true;
includeSudomains: optional directive specifying that this HSTS Policy also applies to any hosts whose domain names are subdomains of the Known HSTS Host's domain name.

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

Parameters:
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

Parameters:
skip: optional directive skipping angularXsrf module if function return "true". Default to function(req, res) {};
cookie: optional directive specifying cookie options used in <a href="http://expressjs.com/api.html#res.cookie" target="_blank">res.cookie</a>.

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

Parameters:
headers: Array indicating which header fields to add Content-Security-Policy (standard) and/or X-Content-Security-Policy, X-Webkit-CSP (experimental). Possible values are ["standard", "experimental"]. Default to standard.
rules_secure: Boolean indicating whether or not use predefined secure directive rules. Default to true.
defaultSrc: Refer to <a href="https://dvcs.w3.org/hg/content-security-policy/raw-file/tip/csp-specification.dev.html#default-src" target="blank">default-src</a> directive.
scriptSrc: Refer to <a href="https://dvcs.w3.org/hg/content-security-policy/raw-file/tip/csp-specification.dev.html#script-src" target="blank">script-src</a> directive.
objectSrc: Refer to <a href="https://dvcs.w3.org/hg/content-security-policy/raw-file/tip/csp-specification.dev.html#object-src" target="blank">object-src</a> directive.
styleSrc: Refer to <a href="https://dvcs.w3.org/hg/content-security-policy/raw-file/tip/csp-specification.dev.html#style-src" target="blank">style-src</a> directive.
imgSrc: Refer to <a href="https://dvcs.w3.org/hg/content-security-policy/raw-file/tip/csp-specification.dev.html#img-src" target="blank">img-src</a> directive.
mediaSrc: Refer to <a href="https://dvcs.w3.org/hg/content-security-policy/raw-file/tip/csp-specification.dev.html#media-src" target="blank">media-src</a> directive.
frameSrc: Refer to <a href="https://dvcs.w3.org/hg/content-security-policy/raw-file/tip/csp-specification.dev.html#frame-src" target="blank">frame-src</a> directive.
fontSrc: Refer to <a href="https://dvcs.w3.org/hg/content-security-policy/raw-file/tip/csp-specification.dev.html#font-src" target="blank">font-src</a> directive.
connectSrc: Refer to <a href="https://dvcs.w3.org/hg/content-security-policy/raw-file/tip/csp-specification.dev.html#connect-src" target="blank">connect-src</a> directive.
sandbox: Refer to <a href="https://dvcs.w3.org/hg/content-security-policy/raw-file/tip/csp-specification.dev.html#sandbox" target="blank">sandbox</a> directive.
reportUri: Refer to <a href="https://dvcs.w3.org/hg/content-security-policy/raw-file/tip/csp-specification.dev.html#report-uri" target="blank">report-uri</a> directive.
reportOnly: Boolean indicating whether or not use Content-Security-Policy-Report-Only header field. The Content-Security-Policy-Report-Only header field lets servers experiment with policies by monitoring (rather than enforcing) a policy. Default to false.
reportFilename: Filename where to write report data. Default to /tmp/esecurity_cspreport
onReport: Function use to write report data. function (data) {...}


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

Parameters:
deny: Boolean indicating whether or not use DENY x-frame-option. Default to true;
sameOrigin: Boolean indicating whether or not use SAMEORIGIN x-frame-option. Default to false;
allowFrom: String indicating origin to use in ALLOW-FROM x-frame-option. Default is empty;
jsUrl: URI to load javascript file containing clickjacking protection. Default to "clickjacking_protection.js";

### ZoneLimit
This module help you to limit request according ip, cookie or anything you want.

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

Parameters:
rate: Number indicating the rate limit ceiling. Default to 100;
window: Number indicating the time window in seconds. Default to 5;
delayGc: Number indicating the delay in seconds before garbage collector is launched. Default to 20;
keyZone: Function which returns name of the zone to catch. Default to  function(req) { return req.ip; };
opts.log: Function to log denied requests. Default is to not log.

### Rate
This module help you to limit request by session and by route.

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

Parameters:
rate: Number indicating the rate limit ceiling. Default to 100;
window: Number indicating the time window in minutes. Default to 15;
enableHeaders: Enable response headers (X-Rate-Limit-Limit, X-Rate-Limit-Remaining, X-Rate-Limit-Reset). Default to false;

With:
X-Rate-Limit-Limit: the rate limit ceiling for that given request
X-Rate-Limit-Remaining: the number of requests left for the N minute window
X-Rate-Limit-Reset: the remaining window before the rate limit resets in UTC epoch seconds


## Viewing Examples

Clone the Esecurity repo, then install the dev dependencies to install all the example / test suite deps:

    $ git clone git://github.com/math-nao/esecurity.git --depth 1
    $ cd esecurity
    $ npm install

then run whichever examples you want:

    $ node examples/cors

You can also view live examples here

<a href="https://runnable.com/esecurity" target="_blank"><img src="https://runnable.com/external/styles/assets/runnablebtn.png" style="width:67px;height:25px;"></a>


## Installation

### Installing npm (node package manager)
```
  curl http://npmjs.org/install.sh | sh
```

### Installing esecurity
```
  [sudo] npm install esecurity
```

## More Documentation
There is more documentation available through docco. I haven't gotten around to making a gh-pages branch so in the meantime if you clone the repository you can view the docs:

```
  open docs/nconf.html
```

## Run Tests
Tests are written in vows and give complete coverage of all APIs and storage engines.

``` bash
  $ npm test
```

#### Author: [Mathieu Naouache](http://nodejitsu.com)
#### License: MIT

