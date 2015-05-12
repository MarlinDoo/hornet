var bodyParser = require('body-parser'); 	// get body-parser
var User       = require('../models/user');
var Token 		 = require('../models/Token');
var jwt        = require('jsonwebtoken');
var config     = require('../../config');
var _ = require('underscore');
var nodemailer = require('nodemailer');
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
		// do logging
		console.log('Somebody just came to our app!');

	  // check header or url parameters or post parameters for token
	  var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	  // decode token
	  if(token){
	    // verifies secret and checks exp
	    jwt.verify(token, superSecret, function(err, decoded) {      
	      if (err) {
	        res.status(403).send({ 
	        	success: false, 
	        	message: 'Failed to authenticate token.' 
	    	});  	   
	      } else { 
	        // if everything is good, save to request for use in other routes
	        req.decoded = decoded;
	        next(); // make sure we go to the next routes and don't stop here
	      }
	    });
	  }
		else {
	    // if there is no token
	    // return an HTTP response of 403 (access forbidden) and an error message
			next()
   	 	//res.status(403).send({
   	 	//	success: false,
   	 	//	message: 'No token provided.'
   	 	//});
	  }
	});
	apiRouter.get('/', function(req, res) {
		res.json({ message: 'hooray! welcome to our api!' });	
	});
	apiRouter.route('/users')
		.post(function(req, res) {
			var user = new User();
			Token.find({username:'31665431@qq.com'},function(error,list){
				if(list.length !=0){
					res.json({error: '已存在用户'});					
				}else{
					var a = jwt.sign({
	        	username: user.username
	        }, superSecret, {
	          expiresInMinutes: 1 // expires in 24 hours
	        });

					var token = new Token({
						username:req.body["username"],
						key:a
					});

					token.save(function(error,list){
						if(!error){
							var transporter = nodemailer.createTransport();
						  transporter.sendMail({
						    from: 'zhailei2011@gmail.com',
						    to: req.body["username"],
						    subject: '邀请您加入通讯录',
						    text: 'http://127.0.0.1:4000/create/'+token['_id']
						  },function(error,info){
						    if(error){
						      res.json({ error: 'User created!' });
						    }else{
						      res.json({ message: 'User created!',list:list});
						    }
						  });
						}
					})
				}
			});
		})
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
				// return that user
				res.json(user);
			});
		})
		.put(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				if (err) res.send(err);
				if (req.body.name) user.name = req.body.name;
				if (req.body.sex) user.sex = req.body.sex;
				if (req.body.username) user.username = req.body.username;
				if (req.body.password) user.password = req.body.password;
				if (req.body.phone) user.phone = req.body.phone;
				if (req.body.summary) user.summary = req.body.summary;
				if (req.body.address) user.address = req.body.address;
				user.save(function(err) {
					if (err) res.send(err);
					res.json({ message: 'User updated!' });
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
	apiRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});
	return apiRouter;
};