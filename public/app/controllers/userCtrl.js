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
	.controller('userEdit', function (User, $routeParams) {
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
	.controller('register', function ($scope,User) {
		this.data = {
			name:'',
			username:'',
			password:'',
			confrimPassword:''
		};
		var self = this;

		this.post = function(){
			if(self.data['password'] == self.data['confrimPassword']){
				User.createUser(self.data)
					.success(function (data) {
						self.processing = false;
						self.userData = {};
						self.message = data.message;
					});
			}else{
				self.error = '密码不一致'
			}
		}
	});