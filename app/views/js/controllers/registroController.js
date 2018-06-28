app.controller('registroController', function($scope, $rootScope, toastr, BASEURL, $window, $location, $http, AuthService, $timeout) {

	$scope.usuario = {
		'strUser': ''
	};

	$scope.livro = {
		'intNome': '',
		'intEstado': '',
		'intNota': '',
		'strObs': '',
	};

	$scope.intNota = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

	$scope.verificarRegistro = function() {
		var strUrl = BASEURL + 'users';
		$http.post(strUrl, $scope.usuario).success(function(response) {
			if (response.length >= 1) {
				$scope.dadosUsuario = response[0];
				$scope.exibeTela = '2';
				$scope.buscarLivros();
				$scope.estadoLivro();
			} else {
				toastr.error('Usuario não encontrado.');
			}
		}).error(function(error) {
			toastr.error('Ocorreu um erro ao buscar os dados do usuário.');
		});
	};

	$scope.estadoLivro = function() {
		var strUrl = BASEURL + 'Books/cons';
		$http.post(strUrl).success(function(response) {
			if (response.length >= 1) {
				console.log(response);
				$scope.strEstado = response;
			} else {
				toastr.error('Nenhuma lista de estado de conservação encontrada.');
			}
		}).error(function(error) {
			toastr.error('Ocorreu um erro ao buscar a lista de estado de conservação.');
		});
	};

	$scope.buscarLivros = function() {
		var strUrl = BASEURL + 'Books';
		$http.get(strUrl).success(function(response) {
			if (response.length >= 1) {
				$scope.dadosLivros = response;
			} else {
				toastr.error('Não existe nenhum livro cadastrado!');
			}
		}).error(function(error) {
			toastr.error('Ocorreu um erro ao buscar os livros.');
		});
	};

	$scope.enviarDados = function() {
		if ($scope.livro.intNome == '') {
			toastr.error('Por favor selecione um livro!');
		} else if ($scope.livro.intEstado == '') {
			toastr.error('Por favor selecione um estado!');
		} else if ($scope.livro.intNota == '') {
			toastr.error('Por favor selecione uma nota!');
		} else if ($scope.livro.strObs.length > 256) {
			toastr.error('O numero máximo de caracteres para a observaçoes é de 256.');
		} else {
			var strUrl = BASEURL + 'Reviews/add';
			var data = {
				livro_opiniao: $scope.livro.intNome.id_livro,
				estado_opiniao: $scope.livro.intEstado.id_estado,
				nota_opiniao: $scope.livro.intNota,
				observacao_opiniao: $scope.livro.strObs,
				usuario_opiniao: $scope.dadosUsuario.id_usuario,
			};
			$http.post(strUrl, data).success(function(response) {
				if (response.affectedRows == 1) {
					toastr.success('Opinião cadastrada com sucesso!');
				} else {
					toastr.error('Opinião já cadastrada para o livro');
				}
				$scope.livro = [];
				$timeout(function() {
					$scope.exibeTela = '3';
				}, 1000);
			}).error(function(error) {
				toastr.error('Erro ao cadastrar opinião!');
			});
		}
	};

	$scope.exibeTela = '1';
	$scope.opcaoMenu = function(opt) {
		if (opt === '1') {
			$scope.livro = {
				'intNome': '',
				'intEstado': '',
				'intNota': '',
				'strObs': '',
			};
			$scope.usuario = {
				'strUser': ''
			};
			$scope.exibeTela = '1';
		} else if (opt === '2') {
			$scope.exibeTela = '2';
		} else if (opt === '3') {
			$scope.exibeTela = '3';
		}
	};

	$scope.opcaoLivro = function(opt) {
		$scope.livro.intNome = opt;
	};

	$scope.opcaoEstado = function(opt) {;
		$scope.livro.intEstado = opt;
	};

});
