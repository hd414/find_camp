var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var flash = require("connect-flash");
var user = require("./models/user");
var bodyParser = require("body-parser");
var local = require("passport-local");
var passportmongoose = require("passport-local-mongoose");
var comment = require("./models/comment");
var Campground = require("./models/Campground");



var seedDB =  require("./seed");

seedDB();


mongoose.connect("mongodb://localhost/yelp_camp")

var app=express();
app.use(flash());

app.use(require("express-session")({
	secret :"Himanshu",
	resave : false,
	 saveUninitialized : false 
}))


app.use(passport.initialize());
app.use(passport.session());


passport.use(new local(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use(function(req,res,next){
	res.locals.currentuser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});


var camp = [
	{name : "salmon greek" ,image : "https://image.shutterstock.com/image-photo/tent-glows-under-night-sky-260nw-281939390.jpg"},
	{name : "granite hill",image :  "https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" },
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
		res.render("index",{camps:camp ,currentuser : req.user});
	}
})
	
})

app.post("/campground",function(req,res){
    
    var name = req.body.newcamp;
    var image = req.body.image;
     var desc = req.body.description;
    var newcamp = {name : name , image:image , description:desc};
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

app.get("/newcampground",islogin,function(req,res){
     res.render("newcamp");
})

app.get("/",function(req,res){
	res.send("here we are");
})

app.get("/campground/:id",function(req,res){
	Campground.findById(req.params.id).populate("comment").exec(function(err,foundcamp){
		if(err)
			 { 
			 	console.log("something went wrong");
			 	console.log(err);
			 }
	    else{
	    	res.render("show",{camps:foundcamp});
	    }
	})
})




app.get("/campground/:id/comment/new",islogin,function(req,res){
	Campground.findById(req.params.id,function(err,foundcamp){
		if(err)
		{
			console.log("something went wrong!!");
		}
		else
		{
			res.render("new_comment",{camps:foundcamp}); 
		}
	})
	
})




app.post("/campground/:id/comment",function(req,res){
    Campground.findById(req.params.id,function(err,camps){
    	if(err)
    		console.log("oooo wrong");
    	else{
    		comment.create(req.body.comment,function(err,comment){
    			if(err)
    				console.log("something is wrong");
    			else
    			{
                  camps.comment.push(comment);
                  camps.save();
                  res.redirect("/campground/"+camps._id);
    			}
    		})
    	}
    })

});


//=======================================================================
//Auth Routes
//=======================================================================


function islogin(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	else
	{req.flash("error","Please Login First!");
		res.redirect("/login");
	}
}




app.get("/register",function(req,res){
	res.render("register");
})


app.post("/register",function(req,res){

	user.register(new user({username : req.body.username}),req.body.password,function(err,user){
      if(err){
      	console.log("Sorryyyyyyy");
      	console.log(err);
      }
      else
      {
      	passport.authenticate("local")(req,res,function(){
           res.redirect("/campground");
      	});
      }

	});
})

app.post("/login",passport.authenticate("local" ,{
	successRedirect : "/campground",
	failureRedirect :"/login"
 }),function(req,res){
	
});





app.get("/login",function(req,res){
res.render("login",{message : "Please Login First!!"});
})




app.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged Out");
	res.redirect("/");
})



app.listen(3000,function(){
	console.log("ready to roll!!!");
})