const mongoose = require('mongoose');
const config = require('./../config')
var db = mongoose.createConnection(config.mongodb);
require('./../lib/models');

const Transaction = db.model('Transaction');

function createLineReader(fileName) {
    
    var EM = require("events").EventEmitter;
    var ev = new EM();
    
    var stream = require("fs").createReadStream(fileName);
    var reminder = null;
    
    stream.on("data", function(data) {
        if (reminder !== null) {
            var tmp = new Buffer(reminder.length + data.length);
            
            reminder.copy(tmp);
            data.copy(tmp, reminder.length);
            data = tmp;
        }
        
        var start = 0;
        for (var i = 0; i < data.length; i++) {
            if (data[i] == 10) {
                var line = data.slice(start, i);
                ev.emit("line", line);
                start = i + 1;
            }
        }
        
        if (start < data.length) {
            reminder = data.slice(start);
        }
        else {
            reminder = null;
        }
    });
    
    stream.on("end", function() {
        if (null !== reminder) {
            ev.emit("line", reminder);
        }
        ev.emit("end");
    });
    return ev;
}

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

//"0123456578","EUR",20111230,"C",2000.00,"0123456789","THRDPARTY",20111230,"cb","","2011.002566.01","PAYMENT","","","",""
//"0123456578","EUR",20111230,"D",4000.00,"0123456789","OWNER",20120102,"tb","","SAVING","","","","",""
*/


//Filename location
var fileName = 'data/mutatie_02.txt';
var count = 0;
var items = [];

function strToDate(str){
    return new Date(str.substr(0, 4), str.substr(4,2) - 1, str.substr(6,2));
}

function str(str){
    return str.length === 2 ? "" : str.substr(1, str.length-2);
}

var lineReader = createLineReader(fileName);
lineReader.on("line", function(line) {
    items.push(line.toString());
});

lineReader.on("end", function(){
    var moneys = 0;
    for (var i = 0, len = items.length; i < len; i++){
        // Full string
        var raw = items[i].split(",");
        if (raw.length > 1){
            var description = '';
            for (var j = 10; j < 15; j++){
                description += str(raw[j]);
            }
            // Hier de data uitpakken en in een model zetten. Geen logica hier.
            new Transaction({
                account: str(raw[0]),
                interestDate: strToDate(raw[2]),
                credit: raw[3][1] == 'C',
                amount: Number(raw[4]), 
                
                from: str(raw[5]),
                name: str(raw[6]),
                bookinDate: strToDate(raw[7]),
                bookCode: str(raw[8]),
                budgetCode: str(raw[9]),
                
                description: description,
                created : new Date()
            }).save(function(err){
                if (err){
                    console.log('Couldnt save data');
                }
            });
        }
    }
    //console.log('finsihed');
});