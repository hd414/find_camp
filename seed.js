var mongoose = require("mongoose");
var comment = require("./models/comment");

var Campground = require("./models/Campground");

var data = [
{
  name : "first",
  image : "https://images.unsplash.com/photo-1584424754226-b3621b1a2b51?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjF9&auto=format&fit=crop&w=500&q=60",
  description :"blah blah blah"
},
{
  name : "second",
  image : "https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" ,
  description :"blah blah blah"
},
{
  name : "third",
  image : "https://images.pexels.com/photos/1230302/pexels-photo-1230302.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" ,
  description :"blah blah blah"
},
{
  name : "fourth",
  image : "https://images.pexels.com/photos/776117/pexels-photo-776117.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" ,
  description :"blah blah blah"
}

]

function seedDB(){
	Campground.remove({},function(err){
		if(err)
			console.log("something went wrong");
		else{
			console.log("Deleted");
      data.forEach(function(data){
    Campground.create(data,function(err,camp){
      if(err)
        console.log("it went wrong");
      else{
              console.log("data added");
                        

                        comment.create({text:"what is this",author:"king"},function(err,comment){
                          if(err)
                          {
                            console.log("can't add comment");
                          }
                          else{
                            camp.comment.push(comment);
                            camp.save();
                            console.log("comment created");
                          }
                        })


            }

    })
  })
  
    }
	})
	
}

module.exports = seedDB;