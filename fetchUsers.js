var https = require("https");
var fs = require("fs")

//https://jsonplaceholder.typicode.com/
const options = {
    hostname : "jsonplaceholder.typicode.com",
    port : 443, //tcp port
    path : "/users",
    method : "GET"
}

var request = https.request(options, function(res){
    
    var count = 0;
    var wholedata = ""
    //data
    res.on("data", function(chunk){

        count++;
        // console.log("I was here")
        // console.log("" + chunk)//string me convert krne se chunk utf8 format me convert ho jata h
        // jo readable hota h by humans
        //5 baar aayga data... 10 users 5 packets me
        wholedata += chunk;
        // console.log(typeof JSON.parse(chunk))//isse error aayga kyuki chunk pura aaya ni hoga or hum uska typeof
        //nikal re h isliye end vle event listener me nikal lenge....... vse object hi hota h wo b

    })

    //end
    res.on("end", function(){   
        // console.log(count);
        // console.log(typeof wholedata);
        var JSONobj = JSON.parse(wholedata);
        fs.writeFileSync("./data/users.json",JSON.stringify(JSONobj));
    })
})

request.end();