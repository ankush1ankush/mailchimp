const bodyParser=require("body-parser");

const request=require("request");

const https=require("https");

const express=require("express");

const fs=require('fs');

const app=express();

app.use(express.static("public")); 

app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static("public"));

var api="";
var audId="";
app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});
fs.readFile('api.txt', 'utf-8', (err, data) => {
    if (err) throw err;
 
    // Converting Raw Buffer to text
    // data using tostring function.
    api=data;
});

fs.readFile('audienceID.txt', 'utf-8', (err, data) => {
    if (err) throw err;
 
    // Converting Raw Buffer to text
    // data using tostring function.
    audId=data;
})
app.post("/signup",function(req,res)
{
 var FirstName=req.body.FirstName;
 var lastName=req.body.LastName;
 var email=req.body.email;
 var data ={
    members:[
        {
            email_address:email,
            status:"subscribed",
            merge_fields:
            {
                FNAME: FirstName,
                LNAME: lastName,
            }

        }
    ]
 };

 const url=`https://us21.api.mailchimp.com/3.0/lists/${audId}`; // url with audience id
 option={
    method:"POST",
    auth :`ankush:${api}`,

 }
 var jsonData= JSON.stringify(data);
 const request =https.request(url,option,function(response){ // api request
    /*response.on("data",function(data){
        console.log(JSON.parse(data));
    });*/
    if(response.statusCode===200)
    {
        res.sendFile(__dirname+"/sucess.html");
    }
    else{
        res.sendFile(__dirname+"/failure.html");
    }

 })
 request.write(jsonData);
 request.end();

});
app.post("/failure",function(req,res){
   res.redirect("/");
});

app.listen( 3000,function(){console.log("listenning to the port number 3000")});

