var mongoose = require("mongoose");


var campSchema = new mongoose.Schema({
	name : String,
	image:String,
	description:String,
	comment : [
	{
		type : mongoose.Schema.Types.ObjectId,
		ref : "comment"
	}
	]
});

var Campground  = mongoose.model("Camp",campSchema);
module.exports = Campground;

