/* Copyright 2013 Intelligent Technology Inc.
 *
 * Released under the MIT license
 * See http://opensource.org/licenses/mit-license.php for full text.
 */

'use strict';

/**
 * Module dependencies.
 */

var express = require('express');
var references = require('./routes/references');
var routes = require('./routes/index');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

//app.get('/', routes.index);

app.get('/references', references.find);
app.post('/references', references.save);
app.put('/references', references.update);
app.del('/references', references.remove);
app.post('/references/:id/comments', references.comments);
app.get('/references/sort', references.sort);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

