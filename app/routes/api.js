var bodyParser = require('body-parser'); 	// get body-parser
var User       = require('../models/user');
var Token 		 = require('../models/Token');
var jwt        = require('jsonwebtoken');
var config     = require('../../config');
var _ 				 = require('underscore');
var nodemailer = require('nodemailer');
var moment 		 = require('moment');

var avatar     = require('../lib/tietuku.io');
var superSecret = config.secret;
module.exports = function(app, express) {
	var apiRouter = express.Router();
	apiRouter.post('/authenticate', function(req, res) {
	  User.findOne({
	    username: req.body.username
	  }).select('name username password').exec(function(err, user) {
	    if (err) throw err;
	    if (!user) {
	      res.json({
	      	success: false,
	      	message: 'Authentication failed. User not found.'
	    	});
	    } else if (user) {
	      var validPassword = user.comparePassword(req.body.password);
	      if (!validPassword) {
	        res.json({
	        	success: false,
	        	message: 'Authentication failed. Wrong password.'
	      	});
	      } else {
	        var token = jwt.sign({
	        	name: user.name,
	        	username: user.username
	        }, superSecret, {
	          expiresInMinutes: 1440 // expires in 24 hours
	        });

	        res.json({
	          success: true,
	          message: 'Enjoy your token!',
	          token: token
	        });
	      }   
	    }
	  });
	});
	apiRouter.use(function(req, res, next) {
	  var token = req.body.token || req.param('token') || req.headers['x-access-token'];
	  if(token){
	    jwt.verify(token, superSecret, function(err, decoded) {
	      if (err) {
	        res.status(403).send({
	        	success: false,
	        	message: 'Failed to authenticate token.'
		    	});
	      } else {
	        req.decoded = decoded;
	        next();
	      }
	    });
	  }
		else {
			next()
	  }
	});
	apiRouter.get('/', function(req, res) {
		res.json({ message: 'hooray! welcome to our api!' });
	});
	apiRouter.route('/users')
		.get(function(req, res) {
			User.find({}, function(err, users) {
				if (err) res.send(err);
				// return the users
				res.json(users);
			});
		});
	apiRouter.route('/users/:user_id')
		.get(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				if (err) res.send(err);
				res.json(user);
			});
		})
		.put(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				if (err) res.send(err);
				_.extend(user,req.body)
				user.save(function(err) {
					if (err) res.send(err);
					res.json({ message: 'User updated!' });
					console.log(user,'这个是什么保存')
				});
			});
		})
		.delete(function(req, res) {
			User.remove({
				_id: req.params.user_id
			}, function(err, user) {
				if (err) res.send(err);
				res.json({ message: 'Successfully deleted' });
			});
		});

	apiRouter.route('/users/:user_id/avatar')
    .post(function(req, res) {
      avatar.upload('/Users/Marlin/tmp/2.png', function(err, user){
        res.json({ message: 'Update avatar success' });
      });
      // res.json({ message: 'Update avatar success' });
    });
  apiRouter.route('/registerEmail')
  	.post(function(req, res) {
			var user = new User();
			Token.find({username:'31665431@qq.com'},function(error,list){
				if(list.length !=0){
					res.json({error: '已存在用户'});					
				}else{
					var a = jwt.sign({
	        	username: user.username
	        }, superSecret, {
	          expiresInMinutes: 30
	        });
					var token = new Token({
						username:req.body["username"],
						key:a,
						register:false
					});
					token.save(function(error,list){
						if(!error){
						}
					})
					var transporter = nodemailer.createTransport();
				  transporter.sendMail({
				    from: 'zhailei2011@gmail.com',
				    to: req.body["username"],
				    subject: '邀请您加入通讯录',
				    text: 'http://localhost:4000/register/'+token['_id']
				  },function(error,info){
				    if(error){
				      res.json({ error: 'User created!' });
				    }else{
				      res.json(_.extend({ message: 'User created!'},list));
				    }
				  });
				}
			});
		})
	apiRouter.route('/register')
		.post(function(req,res){
			var user = new User();
 			_.extend(user,req.body);
 			user.save(function(err,userInfo){
 				console.log(userInfo,123,req.body)
				if(err){
				}else{
 					Token.findById(req.body['id'],function(error,user){
 						user.register = true;
 						user.save(function(error){
 							if(error){
 								console.log(error);
 							}
 						})
 					})
					var token = jwt.sign({
	        	username: user.username
	        }, superSecret, {
	          expiresInMinutes: 1440 // expires in 24 hours
	        });
	        res.json({
	          success: true,
	          message: 'User created!',
	          token: token
	        });
				}
 			});
		})
  apiRouter.route('/register/:registerId')
  	.get(function(req,res){
  		Token.findById(req.params.registerId, function(err, user) {
				if (err){
					res.send(err);	
				}else{
					var a = jwt.decode(user['key']);
					if(a['exp']<parseInt(moment().valueOf()/1000)){
						res.json({
							error:'无法注册',
							errorcode:'unregister'
						})
					}else{
						if(user['register'] == true){
							res.json({error:'此用户名已经注册',errorcode:'registerTrue'});
						}else{
							res.json(user);	
						}
						
					}
				}
			});
  	})
		.put(function(req,res){
			console.log('xxxx');
		})
	apiRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});
	return apiRouter;
};