angular.module('orgService',[])
  .factory('orgData',function($http){
    var http = {};
    http.get = function(id) {
      return $http.get('/api/org/' + id);
    };
    http.all = function() {
      return $http.get('/api/org/');
    };
    http.create = function(data){
      return $http.post('/api/org/',data)
    };
    return http;
  })
