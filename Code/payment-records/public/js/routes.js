// Declare variables used
var App;

// Router
App = Backbone.Router.extend({

    routes: {
        "": "index"
    },

    index: function () {
        // Declare variables
        var payment_listview, payment_list, field, types, sendButton, socket;

        // Set messagelist
        payment_list = new Payments();

        // Set variables
        socket = io.connect(window.location.href);
        field = $('input#field');
        types = $(".type-name");
        sendButton = $('input#send');

        $(".dropdown-menu li a").click(function(){
            $(".btn:first-child").text($(this).text());
            $(".btn:first-child").val($(this).text());
        });

        // Handle sending messages
        sendButton.on('click', function () {
            var price = field.val();
            var typess = types.val();

            socket.emit('send', 
                { 
                    message: price,
                    types: typess,
                    created: Date.now()
                }
            );
            field.val('');
            types.text('Type');
            window.location.reload();
        });

        // Populate the message list
        payment_list.fetch()
            .complete(function () {
                // Render message mist
                payment_listview = new PaymentListView({ collection: payment_list });
                payment_listview.render();

                // Handle new posts and errors
                socket.on('payment', function (data) {
                    if (data.error) {
                        alert('Your message must be at least one character long and not contain whitespace only');
                    } else {
                        payment_list.create({price: data.message, types: data.types, created: data.created});
                        payment_listview.render();
                    }
                });
            });
    }
});
