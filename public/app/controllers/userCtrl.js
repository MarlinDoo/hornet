angular.module('userCtrl', ['userService'])
	.controller('userController', function (User) {
		var vm = this;
		vm.processing = true;
		User.all()
			.success(function (data) {
				vm.processing = false;
				vm.users = data;
			});
		vm.deleteUser = function (id) {
			vm.processing = true;
			User.delete(id)
				.success(function (data) {
					User.all()
						.success(function (data) {
							vm.processing = false;
							vm.users = data;
						});
				});
		};
	})
	.controller('userEdit', function (User, $routeParams, $scope) {
		var vm = this;
		if ($routeParams['user_id']) {
			vm.type = 'edit';
			User.get($routeParams.user_id)
				.success(function (data) {
					vm.userData = data;
				});
			vm.saveUser = function () {
				vm.processing = true;
				vm.message = '';
				User.update($routeParams.user_id, vm.userData)
					.success(function (data) {
						vm.processing = false;
						vm.userData = {};
						vm.message = data.message;
					});
			};
			$scope.selectImage = function( element ) {
				console.log('vm.selectImage' )
				$scope.$apply(function(scope) {
		      console.log('files:', element.files);
		      // Turn the FileList object into an Array
	        scope.files = []
	        for (var i = 0; i < element.files.length; i++) {
	          scope.files.push(element.files[i])
	        }
		      scope.progressVisible = false
	      });
			}
		} else {
			vm.type = 'create';
			vm.saveUser = function () {
				vm.processing = true;
				vm.message = '';
				User.create(vm.userData)
					.success(function (data) {
						vm.processing = false;
						vm.userData = {};
						vm.message = data.message;
					});
			};
		}
	})
	/*.controller('avatarEdit', function (User, $routeParams) {
		var vm = this;
		if ($routeParams['user_id']) {
			vm.type = 'edit';
			User.get($routeParams.user_id)
				.success(function (data) {
					vm.userData = data;
				});
			vm.saveUser = function () {
				vm.processing = true;
				vm.message = '';
				User.update($routeParams.user_id, vm.userData)
					.success(function (data) {
						vm.processing = false;
						vm.userData = {};
						vm.message = data.message;
					});
			};
			vm.file_changed = function(element) {
				console.log('vm.file_changed');
			}
		}
	})*/
	.controller('registerEmail',function(User,AuthToken){
		var self = this;
		this.data = {
			username:'',
			btnDisabled:true,
			loginBtnVal:'注册'
		};
		var re = /\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]{2,}/ ;
		this.userNameChange = function(){
			if(re.test(self.data['username'])){
				self.data['btnDisabled'] = false;
			}else{
				self.data['btnDisabled'] = true;
			}
			self.error = ''
		}
		this.post = function(){
			self.data['btnDisabled'] = true;
			self.data['loginBtnVal'] = '注册中……'
			User.register(self.data)
				.success(function (data) {
					if(data['error']){
						self.error = data['error'];
						self.data['btnDisabled'] = false;
						self.data['loginBtnVal'] = '注册'
					}else{
						self.success = '发送邮件成功，请前往邮箱完成注册！'
						self.data['btnDisabled'] = true;
						self.data['loginBtnVal'] = '注册成功'
					}
				});
		}
	})
	.controller('registerInfo',function(User,AuthToken,$scope,$location,$routeParams){
		var self = this;
		var id = $routeParams['tokenId'];
		this.data = {
			btnValue:'注册',
			btnDisabled:false,
			password:''
		};
		console.log(this)
		$scope.data = this.data
		User.getRegisterInfo(id)
			.success(function(data){
				if(data['errorcode']){
					if(data['errorcode'] == 'unregister'){
						$location.path('/');
					}else{

					}
				}else{
					_.extend(self.data,data)
					self.data.showView = true;
				}
			});
		$scope.$watch('data',function(newValue,oldValue){
			if(self.data['password'] && self.data['password']!=""&& self.data['confrimPassword'] && self.data['confrimPassword']!='' && self.data['password']== self.data['confrimPassword']){
				self.data['btnDisabled'] = false
			}else{
				self.data['btnDisabled'] = true
			}
		},true)
		this.post = function(){
			self.data['btnDisabled'] = true
			self.data['btnValue'] = '注册中……'
			User.registerSave({id:id,username:self.data['username'],password:self.data['password']})
				.success(function(data){
					if(data['error']){
					}else{
						AuthToken.setToken(data['token']);
						$location.path('/users')
					}
				})
		}

	});
