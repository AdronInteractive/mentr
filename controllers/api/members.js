var express = require('express')
    , Member = require('mongoose').model('Member')
    , utils = require('mentr_utils')
    , errors = require('shared').errors;
var app = express();
module.exports = app;

// Find all
app.get('/', function(req, res) {
    Member.find({}, function(err, data) {
        if( err || data == undefined) {
            res.send( (err || errors.DATA_NOT_FOUND).toString() );
        } else {
            res.json( data.map(function(member) {
                return member.publicObject();
            }));
        }
    })
});

// Create a new member
app.post('/', function(req, res) {
    if( !req.body ) {
        return res.send(400, 'No data');
    }

    var member = new Member(req.body);
    member.save(function(err, data) {
        if( err || !data ) {
            res.send(500, (err || errors.UNKNOWN_ERROR).toString() );
        } else {
            res.json(data);
        }
    })
});

// Find one by email
app.get('/:email', utils.requiresAuthHeaders, function(req, res) {
    Member.authenticate( req.param('email'), req.header('password') || req.header('token'), function(err, data) {
        if( err || !data ) {
            res.send(404, (err || errors.INVALID_CREDENTIALS).toString() );
        } else {
            res.json(data);
        }
    });
});

// Create a new member
app.delete('/:email', function(req, res) {

    Member.authenticate( req.param('email'), req.header('password'), function(err, member) {
        if( err || !member ) {
            return res.send(404, (err || errors.INVALID_CREDENTIALS ).toString() );
        }

        Member.remove({ email: member.email }, function(err, data) {
            if( err || !data ) {
                res.send(500, (err || errors.UNKNOWN_ERROR).toString() )
            } else {
                res.send('Member removed');
            }
        })

    });
});