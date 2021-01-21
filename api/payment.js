const express = require('express');

let Publishable_Key = 'pk_test_51IBaxLAbC9SImqZpyaB2IJeIKWIcPMAeqMjtVI9U90sdQNjZzWDSaAAgJ4mXnAvIKQmdVWpF8ZntBHMLUaliuT6E00dczgr6bF'
let Secret_Key = 'sk_test_51IBaxLAbC9SImqZpuRlQpU8Krs2O4rvjaMF4Owzri3mHFtVFeAM1jJuLMHoximjh2svSyqDZetjIdHAZbtVYhK2r00wVaiXt08'

const stripe = require('stripe')(Secret_Key)

app.post('/', function(req, res) {

    // Moreover you can take more details from user 
    // like Address, Name, etc from form 
    stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
            name: 'Obei Ansari',
            address: {
                line1: 'TC 9/4 Old MES colony',
                postal_code: '452331',
                city: 'Mumbai',
                state: 'Maharashtra',
                country: 'India',
            }
        })
        .then((customer) => {

            return stripe.charges.create({
                amount: 2500, // Charing Rs 25 
                description: 'Web Development Product',
                currency: 'INR',
                customer: customer.id
            });
        })
        .then((charge) => {
            res.send("Success") // If no error occurs 
        })
        .catch((err) => {
            res.send(err) // If some error occurs 
        });
})