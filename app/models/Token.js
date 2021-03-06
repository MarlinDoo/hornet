var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');

// user schema 
var Token   = new Schema({
	username: { type: String, required: true, index: { unique: true }},
	key:String,
	register:Boolean
});

// Token.pre('save', function(next) {
// 	next();
// });
module.exports = mongoose.model('Token', Token);