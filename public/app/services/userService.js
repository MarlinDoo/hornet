angular.module('userService', [])
  .factory('User', function($http) {
    var userFactory = {};
    userFactory.get = function(id) {
      return $http.get('/api/users/' + id);
    };
    userFactory.all = function() {
      return $http.get('/api/users/');
    };
    userFactory.create = function(userData) {
      return $http.post('/api/users/', userData);
    };
    userFactory.update = function(id, userData) {
      return $http.put('/api/users/' + id, userData);
    };
    userFactory.delete = function(id) {
      return $http.delete('/api/users/' + id);
    };
    userFactory.register = function(userData){
      return $http.post('/api/registerEmail', userData);
    }
    userFactory.getRegisterInfo = function(id){
      return $http.get('/api/register/'+id);
    }
    userFactory.registerSave = function(userData){
      return $http.post('/api/register/',userData);
    }
    userFactory.forget = function(userData){
      return $http.put('/api/forget/',userData)
    }
    return userFactory;
  });
