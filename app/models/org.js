var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');

// structure schema
var Org   = new Schema({
  name:{type:String,required:true,index:{unique:true}},
  create_at:Date,
  parentId:String,
  user:{
    name:String,
    avatar:String
  },
  category:0
});
/*
  名字，创建时间，创建人，分类（xingzheng ）,parentId

*/
module.exports = mongoose.model('Org', Org);
