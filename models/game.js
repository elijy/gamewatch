var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

//Game Schema for Database
var GameSchema   = new Schema({
	home: String, //home team
	away: String, //away team
	date: String, //game date
	pub: String, //public comment
	pri: String, //private comment
	watched: Boolean, //has the user watched the game or not (true, or false)
	userId: String, //userID who added the game to the database
	userName: String, // username who added game to database (for displaying purposes)
});

//Export to Mongo
module.exports = mongoose.model('Game', GameSchema);