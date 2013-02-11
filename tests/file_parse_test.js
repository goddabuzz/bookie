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
            // Hier de data uitpakken en in een model zetten. Geen logica hier.
            
            // Fun functies
            var num = Number(raw[4]);
            if (isNaN(num)){
                console.log('Error: ' + num);
            } else {
                num = num;
                if (raw[3][1] == 'C'){
                    moneys = moneys + num;
                } else {
                    moneys = moneys - num;
                }
            }
        }
    }
    console.log('Result: ' + moneys.toFixed(2));
});