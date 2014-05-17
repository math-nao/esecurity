var esecurity = require("..");
var express = require("express");
var request = require("./support/http");

describe("CSP", function() {
    describe("with reportOnly", function() {
        it("should work with standard header", function(done) {
            var app = express();

            app.use(esecurity.csp({
                reportOnly: true
            }));

            request(app)
            .get("/")
            .expect("content-security-policy-report-only", "", done);
        });
        
        it("should work with experimental header", function(done) {
            var app = express();

            app.use(esecurity.csp({
                headers: ["experimental"],
                reportOnly: true
            }));

            request(app)
            .get("/")
            .expect("x-content-security-policy-report-only", "")
            .expect("x-webkit-csp-report-only", "", done);
        });
        
        it("should work with both standard and experimental header", function(done) {
            var app = express();

            app.use(esecurity.csp({
                headers: ["standard", "experimental"],
                reportOnly: true
            }));

            request(app)
            .get("/")
            .expect("content-security-policy-report-only", "")
            .expect("x-content-security-policy-report-only", "")
            .expect("x-webkit-csp-report-only", "", done);
        });
        
        it("should work with rules_secure", function(done) {
            var app = express();

            app.use(esecurity.csp({
                reportOnly: true,
                rules_secure: true
            }));

            request(app)
            .get("/")
            .expect("content-security-policy-report-only", "default-src 'none';script-src 'self' www.google-analytics.com ajax.googleapis.com;style-src 'self';img-src 'self';media-src 'self';connect-src 'self'", done);
        });
        
        it("should work with script-src", function(done) {
            var app = express();

            var src = ["'self'", "http://www.example.org/js/*"];
            app.use(esecurity.csp({
                reportOnly: true,
                scriptSrc: src
            }));

            request(app)
            .get("/")
            .expect("content-security-policy-report-only", "script-src " + src.join(" "), done);
        });
        
        it("should work with object-src", function(done) {
            var app = express();

            var src = ["'self'", "http://www.example.org/js/*"];
            app.use(esecurity.csp({
                reportOnly: true,
                objectSrc: src
            }));

            request(app)
            .get("/")
            .expect("content-security-policy-report-only", "object-src " + src.join(" "), done);
        });
        
        it("should work with style-src", function(done) {
            var app = express();

            var src = ["'self'", "http://www.example.org/js/*"];
            app.use(esecurity.csp({
                reportOnly: true,
                styleSrc: src
            }));

            request(app)
            .get("/")
            .expect("content-security-policy-report-only", "style-src " + src.join(" "), done);
        });
        
        it("should work with img-src", function(done) {
            var app = express();

            var src = ["'self'", "http://www.example.org/js/*"];
            app.use(esecurity.csp({
                reportOnly: true,
                imgSrc: src
            }));

            request(app)
            .get("/")
            .expect("content-security-policy-report-only", "img-src " + src.join(" "), done);
        });
        
        it("should work with media-src", function(done) {
            var app = express();

            var src = ["'self'", "http://www.example.org/js/*"];
            app.use(esecurity.csp({
                reportOnly: true,
                mediaSrc: src
            }));

            request(app)
            .get("/")
            .expect("content-security-policy-report-only", "media-src " + src.join(" "), done);
        });
        
        it("should work with frame-src", function(done) {
            var app = express();

            var src = ["'self'", "http://www.example.org/js/*"];
            app.use(esecurity.csp({
                reportOnly: true,
                frameSrc: src
            }));

            request(app)
            .get("/")
            .expect("content-security-policy-report-only", "frame-src " + src.join(" "), done);
        });
        
        it("should work with font-src", function(done) {
            var app = express();

            var src = ["'self'", "http://www.example.org/js/*"];
            app.use(esecurity.csp({
                reportOnly: true,
                fontSrc: src
            }));

            request(app)
            .get("/")
            .expect("content-security-policy-report-only", "font-src " + src.join(" "), done);
        });
        
        it("should work with connect-src", function(done) {
            var app = express();

            var src = ["'self'", "http://www.example.org/js/*"];
            app.use(esecurity.csp({
                reportOnly: true,
                connectSrc: src
            }));

            request(app)
            .get("/")
            .expect("content-security-policy-report-only", "connect-src " + src.join(" "), done);
        });
        
        it("should work with sandbox", function(done) {
            var app = express();

            var src = ["'self'", "http://www.example.org/js/*"];
            app.use(esecurity.csp({
                reportOnly: true,
                sandbox: src
            }));

            request(app)
            .get("/")
            .expect("content-security-policy-report-only", "sandbox " + src.join(" "), done);
        });
        
        it("should work with report-uri", function(done) {
            var app = express();

            var src = ["'self'", "http://www.example.org/js/*"];
            app.use(esecurity.csp({
                reportOnly: true,
                reportUri: src
            }));

            request(app)
            .get("/")
            .expect("content-security-policy-report-only", "report-uri " + src.join(" "), done);
        });
        
        it("should work with posting data to report-uri", function(done) {
            var app = express();

            var url = "/csp/report";
            app.use(express.bodyParser());
            app.use(esecurity.csp({
                reportOnly: true,
                reportUri: url
            }));

            request(app)
            .post(url)
            .send({
                "csp-report": {
                    "document-uri": "http://example.org/page.html",
                    "referrer": "http://evil.example.com/haxor.html",
                    "blocked-uri": "http://evil.example.com/image.png",
                    "violated-directive": "default-src 'self'",
                    "original-policy": "default-src 'self'; report-uri http://example.org/csp-report.cgi"
                }
            })
            .expect(200, done);
        });
    });
    
    describe("without reportOnly", function() {
        it("should work with standard header", function(done) {
            var app = express();

            app.use(esecurity.csp());

            request(app)
            .get("/")
            .expect("content-security-policy", "", done);
        });
        
        it("should work with experimental header", function(done) {
            var app = express();

            app.use(esecurity.csp({
                headers: ["experimental"]
            }));

            request(app)
            .get("/")
            .expect("x-content-security-policy", "")
            .expect("x-webkit-csp", "", done);
        });
        
        it("should work with both standard and experimental header", function(done) {
            var app = express();

            app.use(esecurity.csp({
                headers: ["standard", "experimental"]
            }));

            request(app)
            .get("/")
            .expect("content-security-policy", "")
            .expect("x-content-security-policy", "")
            .expect("x-webkit-csp", "", done);
        });
        
        it("should work with rules_secure", function(done) {
            var app = express();

            app.use(esecurity.csp({
                rules_secure: true
            }));

            request(app)
            .get("/")
            .expect("content-security-policy", "default-src 'none';script-src 'self' www.google-analytics.com ajax.googleapis.com;style-src 'self';img-src 'self';media-src 'self';connect-src 'self'", done);
        });
        
        it("should work with script-src", function(done) {
            var app = express();

            var src = ["'self'", "http://www.example.org/js/*"];
            app.use(esecurity.csp({
                scriptSrc: src
            }));

            request(app)
            .get("/")
            .expect("content-security-policy", "script-src " + src.join(" "), done);
        });
        
        it("should work with object-src", function(done) {
            var app = express();

            var src = ["'self'", "http://www.example.org/js/*"];
            app.use(esecurity.csp({
                objectSrc: src
            }));

            request(app)
            .get("/")
            .expect("content-security-policy", "object-src " + src.join(" "), done);
        });
        
        it("should work with style-src", function(done) {
            var app = express();

            var src = ["'self'", "http://www.example.org/js/*"];
            app.use(esecurity.csp({
                styleSrc: src
            }));

            request(app)
            .get("/")
            .expect("content-security-policy", "style-src " + src.join(" "), done);
        });
        
        it("should work with img-src", function(done) {
            var app = express();

            var src = ["'self'", "http://www.example.org/js/*"];
            app.use(esecurity.csp({
                imgSrc: src
            }));

            request(app)
            .get("/")
            .expect("content-security-policy", "img-src " + src.join(" "), done);
        });
        
        it("should work with media-src", function(done) {
            var app = express();

            var src = ["'self'", "http://www.example.org/js/*"];
            app.use(esecurity.csp({
                mediaSrc: src
            }));

            request(app)
            .get("/")
            .expect("content-security-policy", "media-src " + src.join(" "), done);
        });
        
        it("should work with frame-src", function(done) {
            var app = express();

            var src = ["'self'", "http://www.example.org/js/*"];
            app.use(esecurity.csp({
                frameSrc: src
            }));

            request(app)
            .get("/")
            .expect("content-security-policy", "frame-src " + src.join(" "), done);
        });
        
        it("should work with font-src", function(done) {
            var app = express();

            var src = ["'self'", "http://www.example.org/js/*"];
            app.use(esecurity.csp({
                fontSrc: src
            }));

            request(app)
            .get("/")
            .expect("content-security-policy", "font-src " + src.join(" "), done);
        });
        
        it("should work with connect-src", function(done) {
            var app = express();

            var src = ["'self'", "http://www.example.org/js/*"];
            app.use(esecurity.csp({
                connectSrc: src
            }));

            request(app)
            .get("/")
            .expect("content-security-policy", "connect-src " + src.join(" "), done);
        });
        
        it("should work with sandbox", function(done) {
            var app = express();

            var src = ["'self'", "http://www.example.org/js/*"];
            app.use(esecurity.csp({
                sandbox: src
            }));

            request(app)
            .get("/")
            .expect("content-security-policy", "sandbox " + src.join(" "), done);
        });
        
        it("should work with report-uri", function(done) {
            var app = express();

            var src = ["'self'", "http://www.example.org/js/*"];
            app.use(esecurity.csp({
                reportUri: src
            }));

            request(app)
            .get("/")
            .expect("content-security-policy", "report-uri " + src.join(" "), done);
        });
        
        it("should work with posting data to report-uri", function(done) {
            var app = express();

            var url = "/csp/report";
            app.use(express.bodyParser());
            app.use(esecurity.csp({
                reportUri: url
            }));

            request(app)
            .post(url)
            .send({
                "csp-report": {
                    "document-uri": "http://example.org/page.html",
                    "referrer": "http://evil.example.com/haxor.html",
                    "blocked-uri": "http://evil.example.com/image.png",
                    "violated-directive": "default-src 'self'",
                    "original-policy": "default-src 'self'; report-uri http://example.org/csp-report.cgi"
                }
            })
            .expect(200, done);
        });
    });
});
