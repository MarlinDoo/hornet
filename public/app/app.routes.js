angular.module('app.routes', ['ngRoute'])
	.config(function($routeProvider, $locationProvider) {
		$routeProvider
			.when('/', {
				templateUrl : 'app/views/pages/home.html'
			})
			.when('/login', {
				templateUrl : 'app/views/pages/login.html',
				controller  : 'mainController',
				controllerAs: 'login'
			})
			.when('/users', {
				templateUrl: 'app/views/pages/users/all.html',
				controller: 'userController',
				controllerAs: 'user'
			})
			.when('/users/create', {
				templateUrl: 'app/views/pages/users/single.html',
				controller: 'userEdit',
				controllerAs: 'user'
			})
			.when('/users/:user_id', {
				templateUrl: 'app/views/pages/users/single.html',
				controller: 'userEdit',
				controllerAs: 'user'
			})
			.when('/users/:user_id/avatar', {
				templateUrl: 'app/views/pages/users/avatar.html',
				controller: 'userEdit',
				controllerAs: 'user'
			})
			.when('/register',{
				templateUrl:"app/views/pages/register.html",
				controller :'registerEmail',
				controllerAs: 'register'
			})
			.when('/register/:tokenId',{
				templateUrl:"app/views/pages/registerInfo.html",
				controller :'registerInfo',
				controllerAs: 'register'
			})
			.when('/forget',{
				templateUrl:'app/views/pages/forget.html',
				controller:'forget',
				controllerAs:'forget'
			})
			.when('/forget/:id',{
				templateUrl:'app/views/pages/setPassword.html',
				controller:'passwd',
				controllerAs:'passwd'
			});
		$locationProvider.html5Mode(true);
	});
