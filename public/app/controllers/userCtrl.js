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
	.controller('userEdit', function (User, $routeParams, $scope, $q, $location) {
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
			// edit avatar
			$scope.selectImage = function( element ) {
				// console.log('vm.selectImage' )
				$scope.$apply( function(scope) {
					function readFile(file) {
            var deferred = $q.defer();
            var reader = new FileReader();
            reader.onload = function(e) {
              deferred.resolve(e.target.result);
            };
            reader.onerror = function(e) {
              deferred.reject(e);
            };
            reader.readAsDataURL(file);
            return deferred.promise;
          }
		      readFile( element.files[0] )
		      	.then(function(values) {
              $scope.imageSrc = values;
              vm.ias = $('img.edit-avatar-img').imgAreaSelect({
					      fadeSpeed: 400, handles: true, instance: true,
					      imageWidth: 500, imageHeight: 750
					    });
					    vm.ias.setOptions({ show: true, x1: 199, y1: 149, x2: 200, y2: 150 });
			        vm.ias.animateSelection(125, 75, 275, 225, 'slow');
			        console.log('x1', vm.ias)
            });
	      });
			}
			// get Avatar data (format base64)
			vm.getAvatarData = function (){
				vm.ias = $('img.edit-avatar-img').data('imgAreaSelect');
				var area = vm.ias.getSelection(false);
	      crop_canvas = document.createElement('canvas');
	      crop_canvas.width = area.width;
	      crop_canvas.height = area.height;
	      crop_canvas.getContext('2d').drawImage($('img.edit-avatar-img').get(0), area.x1, area.y1, area.width, area.height, 0, 0, area.width, area.height);
	      return crop_canvas.toDataURL( "image/png" );
	      // window.open(crop_canvas.toDataURL("image/png"));
			}
			// Save Avatar Data
			vm.saveAvatar = function () {
				vm.processing = true;
				vm.message = '';
				vm.userData.avatar = vm.getAvatarData();
				// return;
				User.update($routeParams.user_id, vm.userData)
					.success(function (data) {
						vm.processing = false;
						vm.userData = {};
						vm.message = data.message;
						// Clear circum
						$location.path('/users');
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
			User.registerSave({id:id,name:self.data['name'],username:self.data['username'],password:self.data['password']})
				.success(function(data){
					if(data['error']){
					}else{
						AuthToken.setToken(data['token']);
						$location.path('/users')
					}
				})
		}

	});
