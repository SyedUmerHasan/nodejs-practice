var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var expressValidator = require('express-validator');
var mongojs = require('mongojs')
var db = mongojs("customerapp", ['users']);
var app = express();
var ObjectId = mongojs.ObjectId;
// View Engine
app.set("view engine" ,"ejs");
app.set("views" ,path.join(__dirname,"views"));
//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
//Set Static Path
app.use(express.static(path.join(__dirname, 'public')));
// Express Validator Middeleware
app.use(expressValidator({
    errorFormatter(param, msg, value, location) {
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }
        return{
            param : formParam,
            msg : msg,
            value : value
        };
    }
}));
//Routes
app.post("/submit",function(req, res){
    req.checkBody('first_name', "First Name is required").notEmpty();
    req.checkBody('last_name', "First Name is required").notEmpty();
    req.checkBody('email_address', "Email Address is required").isEmail();
    var errors = req.validationErrors();
    var user_details = {
        first_name : req.body.first_name,
        last_name : req.body.last_name,
        email_address : req.body.email_address
    }
// find everything
    db.users.find(function (err, docs) {
        if(errors){
            res.render("index",{
                title : "Customer" ,
                name : docs,
                errors : errors
            });
        }else{
            db.users.insert(user_details, function (err,result) {
                if(err){
                    console.log("Error on Inserting data");
                }
                else {
                    console.log("Data inserted");
                }
            });
            res.redirect("/");
        }
    });
});
app.get("/",function(req,res){
    db.users.find(function (err, name) {
        res.render("index", {
            title: "Syed Umer Hasan",
            name: name,
            errors: {}
        });
    });
});
app.delete("/users/deleteUser/:id",function (req,res) {
    db.users.remove({"_id" : ObjectId(req.params.id)},function (error,result) {
        if(error){
            console.log(error);
        }
        console.log(req.params.id);
    });
});

app.listen(3000,function(){
    console.log("Server Started on 3000");
});