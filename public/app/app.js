angular.module('userApp', ['app.routes', 'authService', 'mainCtrl', 'userCtrl', 'userService','orgCtrl','orgService'])

// application configuration to integrate token into requests
.config(function($httpProvider) {

	// attach our auth interceptor to the http requests
	$httpProvider.interceptors.push('AuthInterceptor');

});
