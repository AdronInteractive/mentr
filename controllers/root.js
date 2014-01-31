var express = require('express'),
    utils = require('mentr_utils'),
    Member = require('mongoose').model('Member'),
    errors = require('shared').errors;
var app = express();
module.exports = app;

// Helpers
function render(req, res, view, options) {
    utils.isLoggedIn(req, function(user) {
        var opts = {
            page: view,
            isLoggedIn: !!user,
            user: user
        };

        for( var k in options ) {
            if( options.hasOwnProperty(k) && opts.hasOwnProperty(k) ) {
                opts[k] = options[k];
            }
        }

        res.render(view, opts);
    });
}

// Static Pages
app.get('/', function(req, res) {
    render(req, res, 'index', { page: '' });
});

app.get('/register', function(req, res) {
    render(req, res, 'register');
});

app.get('/login', function(req, res) {
    render(req, res, 'login');
});

app.get('/hidden', utils.requiresLogin, function(req, res) {
    render(req, res, 'index', { page: 'hidden'} );
});

// Control Paths
app.post('/login', utils.requiresAuthHeaders, function(req, res) {

    Member.authenticate( req.body.email, req.header('password') || req.header('token'), function(err, data) {
        if( err || !data ) {
            return res.send(404, (err || errors.INVALID_CREDENTIALS).toString() );
        }

        data.generateToken(function(err, member) {
            if( err || !member )
                res.json(206, {
                    data: member || data,
                    error: errors.CANT_MAKE_TOKEN.toString()
                });
            else {
                res.cookie('email', member.email, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: false } );
                res.cookie('token', member.token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: false } );
                res.json(member);
            }
        })
    });
});

app.get('/logout', function(req, res) {
    if( !(req.cookies.email && req.cookies.token) ) {
        return res.redirect('/');
    }

    Member.authenticate( req.cookies.email, req.cookies.token, function(err, member) {
        if( !err && member != undefined ) {
            delete member.token;
            member.save(function() {
                res.clearCookie('email');
                res.clearCookie('token');
                res.redirect('/');
            })
        } else {
            res.redirect('/');
        }
    });
});

app.post('/logout', function(req, res) {

    Member.authenticate( req.param('email'), req.header('password') || req.header('token'), function(err, member) {
        if( err || !member ) {
            return res.send(404, (err || errors.INVALID_CREDENTIALS).toString() );
        }

        delete member.token;
        member.save(function(err, member) {
            if( err || !member ) {
                res.send(500, (err || errors.UNKNOWN_ERROR).toString() );
            } else {
                req.clearCookie('email');
                req.clearCookie('token');
                res.json(member);
            }
        })
    });

});