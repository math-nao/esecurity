var esecurity = require('../..');
var express = require('express');

var app = express();

app.use(esecurity.sendFileLimit({
    max: 500
}));

app.use(function(req, res){
    res.sendFile('./static.html');
});

app.listen(9898);

console.log('Listening on port 9898...');

