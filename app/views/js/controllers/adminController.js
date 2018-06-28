    app.controller('adminController', function($scope, toastr, $rootScope, BASEURL, $window, $location, $http, AuthService) {

    	$scope.usuario = {
    		'strLogin': '',
    		'strSenha': ''
    	};

    	$scope.verificarLogin = function() {
    		var strUrl = BASEURL + 'users/login';
    		$http.post(strUrl, $scope.usuario).success(function(response) {
    			// if (response.length >= 1) {
    			if ($scope.verificaToken(response.token)) {
    				AuthService.saveToken(response.token);
    				$scope.salvaUsuario(response.data[0].id_usuario, response.data[0].nome_usuario);
    				$location.path('/');
    			} else {
    				toastr.error('Senha informada inválida!');
    			}
    		}).error(function(error) {
    			toastr.error('Ocorreu um erro ao fazer o login, tente novamente!');
    		});
    	};

    	$scope.verificaToken = function(res) {
    		//var token = res ? res : false;
    		if (typeof res === "string") {
    			if (JSON.parse(localStorage.getItem('projetoBiblioteca')).jwtTokenprojetoBiblioteca !== null) {
    				return true;
    			} else {
    				AuthService.logout();
    				return false;
    			}
    		} else {
    			return false;
    		}
    	};

    	$scope.salvaUsuario = function(idUser, strNome) {
    		var projetoBiblioteca = [];
    		projetoBiblioteca = {
    			'strNome': strNome,
    			'idUser': idUser,
    			'jwtTokenprojetoBiblioteca': JSON.parse($window.localStorage.getItem('projetoBiblioteca')).jwtTokenprojetoBiblioteca
    		};
    		$window.localStorage.setItem('projetoBiblioteca', JSON.stringify(projetoBiblioteca));
    	};


    	$scope.isLoggedIn = function() {
    		if ($rootScope.intIdUsuarioprojetoBiblioteca) {
    			$location.path('/');
    		}
    	};

    	$scope.isLoggedIn();

    });
