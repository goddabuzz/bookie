/*
1. your own account number(10 characters) 
2. Currencie(3 characters, like EUR) 
3. Interest date(8 characters in this format YYYYMMDD 
4. If you payed money or if you got money( 1 Character, Just a C or a D, Credit or Debit) 
5. Amount of money(up to 14 characters(for people with big money;)) format: EEE.CC the E stands for whole euro's and the C for eurocents) 
6. Account number of the other party(10 characters) 
7. Other party's name(24 characters) 
8. Book date(8 Characters in this format YYYYMMDD) 
9. Book code(2 Characters) 
10. Budget code(6 characters) 
11. Description 1 (32 characters) 
12. Description 2 (32 characters) 
13. Description 3 (32 characters) 
14. Description 4 (32 characters) 
15. Description 5 (32 characters) 
16. Description 6 (32 characters) 
*/
/**
 * Module dependencies.
 */

const Schema = require('mongoose').Schema
    , ObjectId = Schema.ObjectId;

/**
 * Schema.
 */
var Transaction = module.exports = new Schema ({
    account: String,
    interestDate: Date,
    credit: Boolean,
    amount: Number, 
    
    from: String,
    name: String,
    bookinDate: Date,
    bookCode: String,
    budgetCode: String,
    
    description: String,
    created : Date
});

Transaction.statics.getEarnings = function (callback) {
    return this.$where('credit', true).sort('interestDate').exec(callback);
}
Transaction.statics.getExpenses = function (callback) {
    return this.$where('credit', false).sort('interestDate').exec(callback);
}
Transaction.statics.getGroupedByMonth = function(year, credit, callback) {
  year = parseInt(year, 10);
  
  var start = new Date(year, 0, 0);
  var end = new Date(year+1, 0, 0);

  return this.aggregate({ 
    $match: {
      bookinDate: {
        $gte: start,
        $lt: end
      }
    }
  }, {
    $project: {
      amount: 1,
      interest_date: {
        month : { $month: '$interestDate' },
        year : { $year: '$interestDate' }
      },
      expenses: {$cond : [
           {$eq : ["$credit", false]}, "$amount", 0
      ]},
      earnings: {$cond : [
           {$eq : ["$credit", true]}, "$amount", 0
      ]}
    }
  }, {
    $group : {
      _id : "$interest_date",
      total : {
        $sum: "$amount"
      },
      expenses: {
        $sum: "$expenses"
      },
      earnings: {
        $sum: "$earnings"
      }
    }
  },{
    $sort : { 
      _id : 1
    }
  },
  callback);
}