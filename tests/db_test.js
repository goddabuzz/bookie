/**
 *  Includes
 */
const mongoose = require('mongoose');
const config = require('./../config')
const db = mongoose.createConnection(config.mongodb);

/**
 * Prepare models
 */
require('./../lib/models');
const Transaction = db.model('Transaction');

/*
 * Retrieve data
 */
Transaction.getEarnings(function(err, docs){
    var earnings = 0;
    docs.forEach(function(item){
        earnings += item.amount;
    });
    console.log(earnings);
});

Transaction.getExpense(function(err, docs){
    var expense = 0;
    docs.forEach(function(item){
        expense += item.amount;
    });
    console.log(-expense);
});