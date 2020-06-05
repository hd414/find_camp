var express = require("express");
var app = express();
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/yelp_camp")



var campSchema = new mongoose.Schema({
	name : String,
	image:String,
	description:String
});

var Campground  = mongoose.model("Camp",campSchema);

// Campground.create({
// 	name :"salmon greek",
// 	image:"https://image.shutterstock.com/image-photo/tent-glows-under-night-sky-260nw-281939390.jpg",
// 	description:"it is a huge hill "
// },function(err,camp){
// 	if(err){
// 		console.log("something went wrong!!");
// 		console.log(err);
// 	}
// 	else{
// 		console.log("all good");
// 		console.log(camp);
// 	}
// });




var camp = [
	{name : "salmon greek" ,image : "https://image.shutterstock.com/image-photo/tent-glows-under-night-sky-260nw-281939390.jpg"},
	{name : "granite hill",image :  "https://image.shutterstock.com/image-photo/multiple-marshmallows-extended-over-camp-260nw-122697214.jpg" },
	 { name :"mountain goat" , image: "https://image.shutterstock.com/image-photo/camp-forest-adventure-travel-remote-260nw-443840548.jpg"},
	 {name :"Himalayas" , image :"https://image.shutterstock.com/image-photo/friends-camping-eating-food-concept-260nw-520119067.jpg"}
	]
var bodyParser = require("body-parser");
 app.use(bodyParser.urlencoded({extended : true}));


app.set("view engine","ejs");

app.get("/",function(req,res){
	res.render("home");
})

app.get("/campground",function(req,res){
	
Campground.find({},function(err,camp){
	if(err)
	{
		console.log("something went wrong!!");
	}
	else
	{
		res.render("campground",{camps:camp});
	}
})
	
})

app.post("/campground",function(req,res){
    
    var name = req.body.newcamp;
    var image = req.body.image;
    var newcamp = {name : name , image:image};
      Campground.create(newcamp,function(err,camp){
	if(err){
		console.log("something went wrong!!");
		console.log(err);
	}
	else{
		console.log("all good");
		res.redirect("/campground");
	}
});
    
})

app.get("/newcampground",function(req,res){
     res.render("newcamp");
})

app.get("/",function(req,res){
	res.send("here we are");
})

app.get("/campground/:id",function(req,res){
	res.render("show"); 
})

app.listen(3000,function(){
	console.log("ready to roll!!!");
})