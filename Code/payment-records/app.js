var app, express, io, mongoose, port;

express = require("express");
app = express();
mongoose = require('mongoose');
var dbUrl = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/payment';
port = process.env.PORT || 5000;

// Connect DB
mongoose.connect(dbUrl);

// Create a model for the messages
var PaymentSchema = mongoose.Schema({
    price: {
        type: String,
        match: /^(\w+)/
    },
    types: {
        type: String,
        match: /^(\w+)/
    },
    created: {
        type: Date,
        match: /^(\w+)/
    }
});
var Payment = mongoose.model('Payment', PaymentSchema);

// Set up templating
app.set('views', __dirname + '/views/pages');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);

// Define routes
app.get("/", function (req, res) {
    res.render("index");
});

app.get("/payments", function (req, res) {
    Payment.find(function (err, payments) {
        /* istanbul ignore if */
        if (err) {
            console.log('Error: ' + err);
        } else {
            res.json(payments);
        }
    });

    //Get total price:
    //db.payments.aggregate({$match:{}},{$group:{"_id":"$_id",total:{$max:"$price"}}})
    Payment.aggregate([
        {$match:{}},
        {$group:{"_id":"$_id",total:{$max:"$price"}}}
    ]).exec(function(err, total) {       
        if(err) {
            console.log(err)
        };
        //if have records
        if(total) {
            var num = 0;
            for(var i = 0; i < total.length; i++) {
                num += parseInt(total[i].total);
            }
            //num = parseInt(total[0].total) + parseInt(total[1].total);
            console.log(num);
        }       
    });  
});

app.use(express.static(__dirname + '/public'));

// Listen
io = require('socket.io')({
}).listen(app.listen(port));

// Handle new payment
io.sockets.on('connection', function (socket) {
    socket.on('send', function (data) {
        var newPayment;

        // Store it in the database
        newPayment = new Payment({ price: data.payments, types: data.types, created: data.created });
        newPayment.save(function (err) {
            if (err) {
                // Emit the error
                data.error = 'Error: ' + err;
                data.payments = null;
                io.sockets.emit('error', data);
            } else {
                io.sockets.emit('payment', data);
            }
        });
    });
});

console.log("Listening on port " + port);