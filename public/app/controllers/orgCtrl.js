angular.module('orgCtrl', ['orgService'])
  .controller('orgController',function(orgData){
		orgData.all()
			.success(function (data) {
        console.log(data)
			});
  })
  .controller('orgEdit',function(orgData){
    console.log('xxx');
  })
