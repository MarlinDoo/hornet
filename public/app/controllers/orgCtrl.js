angular.module('orgCtrl', ['orgService'])
  .controller('orgController',function(orgData){
		orgData.all()
			.success(function (data) {
        console.log(data)
			});
  })
  .controller('orgEdit',function(orgData){
    var self = this;
    this.data = {
      loginBtnVal:'注册',
      btnDisabled:false,
      category:0
    }
    this.changeName = function(){
      self.error = ''
    }

    this.selectChange = function(){
      console.log(self.data['category'])
    }
    this.post = function(){
			self.data['loginBtnVal'] = '注册中……'
      self.data['btnDisabled'] = true;
			orgData.create({name:this.data['name'],category:this.data['category']})
				.success(function (data) {
          self.data['btnDisabled'] = false;
          self.data['loginBtnVal'] = '注册';
          if(data['error']){
            self.error = data['error']
          }else{
            self.success = '注册成功'
          }
				});
    }
  })
