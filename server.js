//==================
// Modules
//==================
var express = require('express'),
    stylus = require('stylus'),
    nib = require('nib'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    path = require('path');

//==================
// Initialization
//==================
var port = process.env.PORT || 3000;
var app = express();

// Include Models
mongoose.connect('mongodb://localhost/mentr');
var models_path = __dirname + '/schemas';
fs.readdirSync(models_path).forEach(function (file) {
    if (~file.indexOf('.js')) require(models_path + '/' + file)
});

// Index shared files
var shared_files = {};
var shared_path = __dirname + '/node_modules/shared/bin';
fs.readdirSync(shared_path).forEach(function (file) {
    if (~file.indexOf('.js')) {
        shared_files[file] = shared_path + '/' + file;
    }
});

// Index partials
var view_partials = [];
var partials_path = __dirname + '/views/partials';
fs.readdirSync(partials_path).forEach(function (file) {
    if (~file.indexOf('.jade')) {
        view_partials.push( file.substring(0, file.length-5) );
    }
});

//==================
// Configuration
//==================
app.configure(function () {
    app.set('port', port);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', {layout:false});
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());

    app.use( '/api', require('./controllers/api/api.js') );
    app.use( require('./controllers/root.js') );
    app.get( '/shared/:filename', function(req, res) {
        var requestedFile = shared_files[req.param('filename')];
        if( requestedFile )
            res.sendfile( requestedFile );
        else
            res.send(404);
    });
    app.get( '/partials/:filename', function(req, res) {
        if( ~view_partials.indexOf(req.param('filename')) )
            res.render( 'partials/' + req.param('filename') );
        else
            res.send(404);
    });

    app.use(stylus.middleware({
        src: __dirname + '/public',
        debug: true,
        force: true,
        compile: function(str, path) {
            return stylus(str)
                .set('filename', path)
                .use( nib() );
        }
    }));
    app.use(express.static(path.join(__dirname + '/public')));
});

app.configure('development', function () {
    app.locals.pretty = true;
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

//==================
// Start Server
//==================
app.listen(port, function () {
    console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});