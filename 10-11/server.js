var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');
var cors = require('cors')

// configure app
app.use(cors());
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set our port
app.listen(8080, function () {

});
// DATABASE SETUP
var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:12345@ds161455.mlab.com:61455/mongod'); // connect to our database

// Handle the connection event
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    console.log("DB connection alive");
});

// Bear models lives here
var Bear = require('./models/bear');

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// on routes that end in /bears
// —------------------------------------------------—
router.route('/bears')

// create a bear (accessed at POST http://localhost:8080/bears)
    .post(function(req, res) {

        var bear = new Bear(); // create a new instance of the Bear model
        bear.title = req.body.title;
        bear.longdescription = req.body.longdescription; // set the bears name (comes from the request)
        bear.shortdescription = req.body.shortdescription;
        bear.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Review created!' });
        });


    })

    // get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function(req, res) {
        Bear.find(function(err, bears) {
            if (err)
                res.send(err);

            res.json(bears);
        });
    });

// on routes that end in /bears/:bear_id
// —------------------------------------------------—
router.route('/bears/:bear_id')

// get the bear with that id
    .get(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err)
                res.send(err);
            res.json(bear);
        });
    })

    // update the bear with this id
    .put(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {

            if (err)
                res.send(err);

            bear.title = req.body.title;
            bear.longdescription = req.body.longdescription;
            bear.shortdescription = req.body.shortdescription
            bear.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Bear updated!' });
            });

        });
    })

    // delete the bear with this id
    .delete(function(req, res) {
        Bear.remove({
            _id: req.params.bear_id
        }, function(err, bear) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });


// REGISTER OUR ROUTES —---------------------------—
app.use('/api', router);
