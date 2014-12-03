// Declare variables used
var Payments;

// Collection for messages
Payments = Backbone.Collection.extend({

    // Will hold Message objects
    model: Payment,

    // Set URL
    url: '/payments'
});