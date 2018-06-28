var app = angular.module('app', ['ngRoute', 'ngMask', 'toastr', 'blockUI', 'ui.utils.masks', 'ui.grid', 'ui.grid.pagination', 'ui.grid.autoResize', 'ui.grid.grouping', 'ui.grid.selection', 'perfect_scrollbar', 'ui.grid.expandable', 'ui.grid.pinning', 'ui.grid.exporter']);

app.run(function($rootScope, $location, AuthService, toastr, $window) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        toastr.clear();

        if ($location.path() !== '/registro') {
            if (!AuthService.isAuthed()) {
                $rootScope.exibeMenuprojetoBiblioteca = false;
                $location.path('/admin');
            }
            if ($window.localStorage.getItem('projetoBiblioteca') !== null){
                $rootScope.exibeMenuprojetoBiblioteca = true;
                $rootScope.strNomeUsuarioprojetoBiblioteca = JSON.parse($window.localStorage.getItem('projetoBiblioteca')).strNome;
                $rootScope.intIdUsuarioprojetoBiblioteca = JSON.parse($window.localStorage.getItem('projetoBiblioteca')).idUser;
            }else{
                $rootScope.exibeMenuprojetoBiblioteca = false;
                $location.path('/admin');
            }
        }else{
            $rootScope.exibeMenuprojetoBiblioteca = false;
        }
    });
});

app.constant('BASEURL', 'http://127.0.0.1:3000/');

app.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
});

app.config(function($routeProvider) {
    $routeProvider

        .when('/', {
            templateUrl: 'pages/dashboard.html',
            controller: 'dashboardController'
        })

        .when('/usuarios', {
            templateUrl: 'pages/usuarios.html',
            controller: 'usuarioController'
        })

        .when('/livros', {
            templateUrl: 'pages/livros.html',
            controller: 'livrosController'
        })

        .when('/relatoriosGeral', {
            templateUrl: 'pages/relatoriosGeral.html',
            controller: 'relatoriosGeralController'
        })

        .when('/relatoriosUsuarios', {
            templateUrl: 'pages/relatoriosUsuarios.html',
            controller: 'relatoriosUsuariosController'
        })

        .when('/relatoriosLivros', {
            templateUrl: 'pages/relatoriosLivros.html',
            controller: 'relatoriosLivrosController'
        })

        .when('/editar-senha', {
            templateUrl: 'pages/editar-senha.html',
            controller: 'editarSenhaController'
        })

        .when('/admin', {
            templateUrl: 'pages/admin.html',
            controller: 'adminController'
        })

        .when('/registro', {
            templateUrl: 'pages/registro.html',
            controller: 'registroController'
        })

        .otherwise({
            redirectTo: '/admin'
        });

});

app.factory('AuthInterceptor', function(BASEURL, AuthService, $q) {
    return {
        request: function(config) {
            var token = AuthService.getToken();
            if (config.url.indexOf(BASEURL) === 0 && token) {
                 config.headers['x-access-token'] = token;
            }
            return config;
        },
        response: function(res) {
            if (res.config.url.indexOf(BASEURL) === 0 && res.data.token) {
                AuthService.saveToken(res.data.token);
            }
            return res;
        },
        responseError: function(res) {
            // Caso ele receba o cabeçalho de 'Não Autorizado', o sistema faz o logout.
            if (res.status === 401) {
                AuthService.logout();
            }
            return $q.reject(res);
        }
    };
});

app.service('AuthService', function($window, $location, $rootScope) {
    // Metodos do JWT
    this.parseJwt = function(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse($window.atob(base64));
    };
    this.saveToken = function(token) {
        var projetoBiblioteca = [];
        projetoBiblioteca= {
            'jwtTokenprojetoBiblioteca': token
        };
        $window.localStorage.setItem('projetoBiblioteca', JSON.stringify(projetoBiblioteca));
    };
    this.getToken = function() {
        if ($window.localStorage.getItem('projetoBiblioteca') !== null){
            return JSON.parse($window.localStorage.getItem('projetoBiblioteca')).jwtTokenprojetoBiblioteca;
        }
    };
    this.isAuthed = function() {
        var token = this.getToken();
        if (token) {
            var params = this.parseJwt(token);
            return params;
        } else {
            return false;
        }
    };
    this.logout = function() {
        $window.localStorage.removeItem('projetoBiblioteca');
        delete $rootScope.strNomeUsuarioprojetoBiblioteca;
        delete $rootScope.intIdUsuarioprojetoBiblioteca;
        $location.path('/admin');
    };
});

app.config(function(toastrConfig) {
    angular.extend(toastrConfig, {
        "positionClass": "toast-center-center",
        "closeButton": true,
        "maxOpened": 1,
        "extendedTimeOut": 5000
    });
});

app.config(function(blockUIConfig) {
      blockUIConfig.message = 'Carregando...';
});

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

/*
Arquivo com js utilizado em várias páginas
*/
app.controller('appController', function ($scope, toastr, $window, AuthService, BASEURL) {

    /*
     * Logout no Header
     */
    $scope.doLogout = function() {
        AuthService.logout();
    };

    // controller do menu lateral
    $scope.HeaderController = function ($scope, $location) {
        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };
    };

    $scope.$on('$viewContentLoaded', function () {

        // vir o nome certo do modal, se é cadastrar ou editar
        $('#modalInserirEditar').on('show.bs.modal', function (event) {
            var recipient = $(event.relatedTarget).data('tipo');
            $(this).find('.modalTipo').text(recipient);
        });

        // mostra e esconde filtro de acordo com o select
        $('#lstBuscaFiltro').change(function() {
            var option = $(this).val();

            $('.filtro.open').fadeOut().fadeOut( "fast", function() {
                $(this).removeClass('open');
                $('#filtro-'+option).fadeIn().addClass('open');
            });
        });

        // options do tooltip
        $(document).tooltip({
            selector: '[data-toggle="tooltip"]'
        });

        // options do datetimepicker quando for data
        $('.datepicker').datetimepicker({
            locale: 'pt-br',
            viewMode: 'days',
            format: 'DD/MM/YYYY'
        });

        // máscara do datetimepicker quando for data
        $(".datepicker input").mask("99/99/9999");

        // options do datetimepicker quando for hora
        $('.timepicker').datetimepicker({
            format: 'HH:mm'
        });

        // máscara do datetimepicker quando for hora
        $(".timepicker input").mask("99:99");

        // limpa formulários - form e apenas um input
        jQuery.fn.reset = function (){
            var element = $(this).is("form");
            if (element == true) {
                $(this).each (function(){
                    this.reset();
                });
            } else {
                if($(this).is("input")) {
                    $(this).val("");
                } else if($(this).is(":radio")) {

                    if ( $(this).hasClass('first-option') )
                    $(this).prop({ checked: true })
                    else
                    $(this).prop({ checked: false })

                } else if($(this).is("select")) {
                    $(this).prop('selectedIndex',0);
                } else if($(this).is("textarea")) {
                    $(this).val("");
                }
            }
        };

        // limpar os forms quando muda de aba
        $(document).on('shown.bs.tab', function (e) {
            var tab = $(e.relatedTarget).attr('data-target');

            $(tab+' form').reset();

            $(tab+' form').removeClass('ng-submitted');
            $(tab+' .form-label').each(function() {
                $('.form-label').removeClass('has-error');
            });

            if (tab === '#search') {
                $('#search-result').fadeOut().removeClass('show').addClass('hide');
                $('#noResult').remove();
            } else if (tab === '#create') {
                $('.alert').remove();
            }
        });

        // quando for celular, fechar o menu quando clicar em um link do menu
        var tam = $(window).width();

        if (tam <800 ){
            $(".second-nav li").each(function () {
                $(this).addClass("close-menu");
            });
        } else {
            $(".second-nav li").each(function () {
                $(this).removeClass("close-menu");
            });
        }

        $('.close-menu').on("click", function(){
            $('#sidebar').removeClass('active');
        });

    });
});

app.controller('dashboardController', function($scope, $rootScope, BASEURL, $window, $http, toastr, $location, $timeout) {

    $scope.countLivros = function(){
        var strUrl = BASEURL + 'books/count';
        $http.post(strUrl).success(function(response){
            if (response.length >= 1) {
                $scope.totalLivros = response[0].totalLivros;
            } else {
                toastr.error('Nào foi possivel buscar nenhum livro cadastro no sistema.');
            }
        }).error(function(error){
            toastr.error('Não foi possível realizar a pesquisa!');
        });
    };

    $scope.countUsuarios = function(){
        var strUrl = BASEURL + 'users/count';
        $http.post(strUrl).success(function(response){
            if (response.length >= 1) {
                $scope.totalUsuarios = response[0].totalUsuarios;
            } else {
                toastr.error('Nào foi possivel buscar nenhum usuário cadastro no sistema.');
            }
        }).error(function(error){
            toastr.error('Não foi possível realizar a pesquisa!');
        });
    };

    $scope.countLivros();
    $scope.countUsuarios();

});

app.controller('editarSenhaController', function ($scope, $http, BASEURL, $rootScope, $window, toastr) {
    $scope.request = {
        operacao: "edit_password",
        oldPasswd: '',
        confirmPasswd: '',
        newPasswd: ''
    };

    $scope.changePassword = function() {
        if ($scope.request.newPasswd.length < 6){
            toastr.error('A senha digitada deve conter ao menos 6 caracteres!');
        }
        else if ($scope.request.newPasswd !== $scope.request.confirmPasswd){
            toastr.error('As senhas digitadas devem ser iguais!');
        }else{
            var url = BASEURL + 'users/changepass';
            var data = {
                'newPass': $scope.request.newPasswd,
                'oldPasswd': $scope.request.oldPasswd,
                'idUser': $rootScope.intIdUsuarioprojetoBiblioteca
            }
            $http.post(url, data).success(function(response){
                if(response.affectedRows === 1) {
                    toastr.success('Senha Alterada com sucesso!');
                    $scope.request = {
                        operacao: "edit_password",
                        oldPasswd: '',
                        confirmPasswd: '',
                        newPasswd: ''
                    };
                } else {
                    toastr.error('Não foi possivel alterar sua senha!');
                }
            }).error(function(data){
                toastr.error('Não foi possivel alterar sua senha!');
            });
        }
    };

});

app.controller('livrosController', function($scope, BASEURL, $http, $filter, toastr) {

	$scope.showDiv = false;

	$scope.carregaLivros = function() {
		var strUrl = BASEURL + 'Books';
		$http.put(strUrl).success(function(response) {
			if (response.length >= 1) {
				$scope.dadosLivros = response
				angular.forEach($scope.dadosLivros, function(key, value) {
					key.ativoExibicao = $scope.retornarDescricaoStatus(key.ativo_livro);
					key.disponivelExibicao = $scope.retornarDispoStatus(key.disponivel_livro);
				});
				$scope.gridOptions1.data = $scope.dadosLivros;
			} else {
				toastr.error('Não existe nenhum livro cadastrado!');
			}
		}).error(function(error) {
			toastr.error('Não foi possível realizar a pesquisa!');
		});
	};

	$scope.gridOptions1 = {
		enableSorting: true,
		paginationPageSizes: [10, 50, 75],
		paginationPageSize: 10,
		enableVerticalScrollbar: 0,
		rowHeight: 35,
		rowTemplate: '<div ng-class="{ inativo : row.entity.ativo_livro==0 }"> <div ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div></div>',
		columnDefs: [{
				name: ' ',
				enableColumnMenu: false,
				cellTemplate: '<a role="button" data-toggle="modal" data-target="#modalInserirEditar" class="table-icon" data-tipo="Editar" ng-click="grid.appScope.modalAlterarLivro(row.entity);"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>',
				width: 30
			},
			{
				field: 'id_livro',
				displayName: 'Código'
			},
			{
				field: 'nome_livro',
				displayName: 'Título'
			},
			{
				field: 'autor_livro',
				displayName: 'Autor'
			},
			{
				field: 'editora_livro',
				displayName: 'Editora'
			},
			{
				field: 'ano_livro',
				displayName: 'Ano'
			},
			{
				field: 'ativoExibicao',
				displayName: 'Status'
			},
			{
				field: 'disponivelExibicao',
				displayName: 'Disponibilidade'
			}
		]
	};

	$scope.pesquisarLivros = function() {
		$scope.showDiv = true;
		if (($scope.opcaoBusca === undefined) || ($scope.opcaoBusca === '')) {
			$scope.carregaLivros();
		} else if (($scope.opcaoBusca !== undefined || $scope.opcaoBusca !== '') && ($scope.gridOptions1.data === '' || $scope.gridOptions1.data === undefined)) {
			var strUrl = BASEURL + 'Books';
			$http.put(strUrl).success(function(response) {
				if (response.length >= 1) {
					$scope.dadosLivros = angular.copy(response);
					angular.forEach($scope.dadosLivros, function(key, value) {
						key.ativoExibicao = $scope.retornarDescricaoStatus(key.ativo_livro);
						key.disponivelExibicao = $scope.retornarDispoStatus(key.disponivel_livro);
					});
					$scope.dadosLivrosCopy = angular.copy($scope.dadosLivros);
					$scope.opcaoBuscaCopy = angular.copy($scope.opcaoBusca);
					$scope.dadosLivrosCopy = $filter('filter')($scope.dadosLivrosCopy, $scope.opcaoBuscaCopy);
					$scope.gridOptions1.data = $scope.dadosLivrosCopy;

				} else {
					toastr.error('Não foi possível carregar os dados, tente novamente mais tarde!');
				}
			}).error(function(error) {
				toastr.error('Não foi possível realizar a pesquisa!');
			});
		} else {
			$scope.dadosLivrosCopy = angular.copy($scope.dadosLivros);
			$scope.opcaoBuscaCopy = angular.copy($scope.opcaoBusca);
			$scope.dadosLivrosCopy = $filter('filter')($scope.dadosLivrosCopy, $scope.opcaoBuscaCopy);
			$scope.gridOptions1.data = $scope.dadosLivrosCopy;
		}
	};

	$scope.cadastrarLivro = function() {
		if ($scope.cadastro.strTitulo.length > 50) {
			toastr.error('O numero máximo de caracteres para o título é de 50.');
		} else if ($scope.cadastro.strAutor.length > 50) {
			toastr.error('O numero máximo de caracteres para o autor é de 50.');
		} else if ($scope.cadastro.strEditora.length > 50) {
			toastr.error('O numero máximo de caracteres para a editora é de 50.');
		} else if (typeof $scope.cadastro.strAno === 'number') {
			toastr.error('O ano informado não é válido.');
		} else {
			var strUrl = BASEURL + 'books/insert';
			var data = $scope.cadastro;
			$http.post(strUrl, data).success(function(response) {
				if (response.affectedRows == 1) {
					toastr.success('Livro cadastrado com sucesso!');
					$scope.carregaLivros();
					$('#modalInserirEditar').modal('toggle');
				} else {
					toastr.error('Não foi possível cadastrar o livro!');
				}
			}).error(function(error) {
				toastr.error('Erro ao cadastrar o livro!');
			});
		}
	};

	$scope.modalAlterarLivro = function(intLinha) {
		$scope.cadastro = {
			'intLivro': intLinha.id_livro,
			'blnAtivo': intLinha.ativo_livro,
			'strEditora': intLinha.editora_livro,
			'strTitulo': intLinha.nome_livro,
			'strAutor': intLinha.autor_livro,
			'strAno': intLinha.ano_livro,
			'intOpcao': '1'
		};
	};

	$scope.opcaoLivro = function(intOpcao) {
		if (intOpcao === "1") {
			$scope.alterarLivro();
		} else {
			$scope.cadastrarLivro();
		}
	};

	$scope.opcaoLivroCadastro = function(intOpcao) {
		$scope.cadastro = {
			'blnAtivo': '0',
			'strEditora': '',
			'strTitulo': '',
			'strAutor': '',
			'strAno': '',
			'intOpcao': '0'
		};
	};

	$scope.alterarLivro = function() {
		if ($scope.cadastro.strTitulo.length > 50) {
			toastr.error('O numero máximo de caracteres para o título é de 50.');
		} else if ($scope.cadastro.strAutor.length > 50) {
			toastr.error('O numero máximo de caracteres para o autor é de 50.');
		} else if ($scope.cadastro.strEditora.length > 50) {
			toastr.error('O numero máximo de caracteres para a editora é de 50.');
		} else if (typeof $scope.cadastro.strAno === 'number') {
			toastr.error('O ano informado não é válido.');
		} else {
			var strUrl = BASEURL + 'books/update';
			var data = $scope.cadastro;
			$http.post(strUrl, data).success(function(response) {
				if (response.affectedRows == 1) {
					toastr.success('Livro alterado com sucesso!');
					$scope.carregaLivros();
					$('#modalInserirEditar').modal('toggle');
				} else {
					toastr.error('Não foi possível alterar o livro!');
				}
			}).error(function(error) {
				toastr.error('Não foi possível alterar o livro!');
			});
		}
	};

	$scope.retornarDescricaoStatus = function(intStatus) {
		intStatus = parseInt(intStatus);
		if (intStatus === 1) {
			return "Inativo";
		} else {
			return 'Ativo';
		}
	};

	$scope.retornarDispoStatus = function(intStatus) {
		intStatus = parseInt(intStatus);
		if (intStatus === 1) {
			return "Emprestado";
		} else {
			return 'Disponível';
		}
	};

	$scope.pesquisarLivros();
});

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

app.controller('relatoriosGeralController', function ($scope, $rootScope, BASEURL, $window, $http, $timeout, $filter, toastr) {

    $scope.carregaAvaliacoes = function(){
        var strUrl = BASEURL + 'Reviews';
        $http.post(strUrl).success(function(response){
            if (response.length >= 1) {
                $scope.showDiv = true;
                $scope.dadosAvaliacoes = angular.copy(response);
                $scope.gridOptions1.data = $scope.dadosAvaliacoes;
            } else {
                toastr.error('Não existe nenhuma avaliação cadastrada!');
            }
        }).error(function(error){
            toastr.error('Não foi possível realizar a pesquisa!');
        });
    };

    $scope.gridOptions1 = {
        enableSorting: true,
        paginationPageSizes: [10, 50, 75],
        paginationPageSize: 10,
        enableVerticalScrollbar: 0,
        rowHeight:35,
        columnDefs: [
            { field: 'id_opiniao', displayName: 'Código'},
            { field: 'nome_livro', displayName: 'Livro' },
            { field: 'nome_usuario', displayName: 'Usuário'},
            { field: 'nota_opiniao', displayName: 'Nota', width:100 },
            { field: 'estadoExibicao', displayName: 'Estado do Livro' },
            { displayName: 'Opinião', name: ' ', enableColumnMenu: false, cellTemplate:'<a role="button" data-toggle="modal" data-target="#modalInserirEditar" class="table-icon" data-tipo="Opinião" ng-click="grid.appScope.modalInserirEditar(row.entity);"><i class="fa fa-search-plus" aria-hidden="true"></i></a>'}
        ]
    };

    $scope.modalInserirEditar = function(intLinha){
        $scope.opiniao = intLinha;
    };

    $scope.pesquisarAvaliacoes = function() {
        $scope.dadosPesquisa = $filter('filter')($scope.dadosAvaliacoes, $scope.opcaoBusca);
        $scope.gridOptions1.data = $scope.dadosPesquisa;
    };

    $scope.carregaAvaliacoes();
});

app.controller('relatoriosLivrosController', function ($scope, $rootScope, BASEURL, $window, $http, $timeout, $filter, toastr) {

    $scope.carregaLivros = function(){
        var strUrl = BASEURL + 'Books';
        $http.get(strUrl).success(function(response){
            if (response.length >= 1) {
                $scope.dadosLivros = response;
                $scope.carregaAvaliacoes();
            } else {
                toastr.error('Não existe nenhum livro cadastrado!');
            }
        }).error(function(error){
            toastr.error('Não foi possível realizar a pesquisa!');
        });
    };

    $scope.carregaAvaliacoes = function(){
        var strUrl = BASEURL + 'Reviews';
        $http.post(strUrl).success(function(response){
            if (response.length >= 1) {
                $scope.dadosAvaliacao = response;
                var relatorio = [];
                angular.forEach($scope.dadosLivros, function(keyLivro, valueLivro){
                    relatorioOpiniao = [];
                    var nota = 0;
                    var count = [];

                    angular.forEach($scope.dadosAvaliacao, function(keyNotas, valueNotas){
                        var count2 = 0;
                        if (keyLivro.id_livro == keyNotas.livro_opiniao){
                            var dataOpiniao = {
                                'estado_opiniao': keyNotas.estado_opiniao,
                                'nota_opiniao': keyNotas.nota_opiniao
                            }
                            for(var i=0;i<4;i++) {
                                if(keyNotas.estado_opiniao == i){
                                    count2++;
                                    count.push(count2);
                                }
                            }
                            nota = nota + keyNotas.nota_opiniao;
                            relatorioOpiniao.push(dataOpiniao);
                        }
                    });
                    var NotaMedia = 0;
                    var PorcentagemOpiniao = 0;
                    var Opiniao = [];
                    if (nota || nota != 0){
                        NotaMedia = nota/relatorioOpiniao.length
                    }
                    for(var i=0;i<4;i++) {
                        if (count[i]){
                            PorcentagemOpiniao = count[i]/relatorioOpiniao.length
                            Opiniao.push(PorcentagemOpiniao);
                        }else{
                            Opiniao.push(0);
                        }
                    }
                    var data = {
                        'id_livro': keyLivro.id_livro,
                        'nome_livro': keyLivro.nome_livro,
                        'autor_livro': keyLivro.autor_livro,
                        'opiniao': relatorioOpiniao,
                        'qtdeOpiniao': relatorioOpiniao.length,
                        'notaMedia': NotaMedia,
                        'PorcentagemOpiniao': Opiniao
                    }
                    relatorio.push(data);
                });
                $scope.showDiv = true;
                $scope.gridOptions1.data = relatorio;
            } else {
                toastr.error('Não existe nenhuma avaliação cadastrada!');
            }
        }).error(function(error){
            toastr.error('Não foi possível realizar a pesquisa!');
        });
    };

    $scope.gridOptions1 = {
        enableSorting: true,
        paginationPageSizes: [10, 50, 75],
        paginationPageSize: 10,
        enableVerticalScrollbar: 0,
        rowHeight:100,
        columnDefs: [
            { field: 'id_livro', displayName: 'Código'},
            { field: 'nome_livro', displayName: 'Livro' },
            { field: 'autor_livro', displayName: 'Autor' },
            { field: 'qtdeOpiniao', displayName: 'Total de Avaliações' },
            { field: 'opiniao', displayName: 'Estado de Conservação', cellTemplate:'<div>Ótimo ---- {{row.entity.PorcentagemOpiniao[0] * 100| number :1 }}%</div><div>Bom ------ {{row.entity.PorcentagemOpiniao[1] * 100| number :1 }}%</div><div>Ruim ----- {{row.entity.PorcentagemOpiniao[2] * 100| number :1 }}%</div><div>Regular -- {{row.entity.PorcentagemOpiniao[3] * 100| number :1 }}%</div>'},
            { field: 'notaMedia', displayName: 'Nota média'}
            // { displayName: 'Opiniões', name: ' ', enableColumnMenu: false, cellTemplate:'<a role="button" data-toggle="modal" data-target="#modalInserirEditar" class="table-icon" data-tipo="Livros" ng-click="grid.appScope.modalInserirEditar(row.entity);"><i class="fa fa-search-plus" aria-hidden="true"></i></a>' },
        ]
    };

    $scope.modalInserirEditar = function(intLinha){
        var strUrl = BASEURL + 'Books/find';
        var data = {'id_usuario': intLinha.id_usuario}
        $http.post(strUrl, data).success(function(response){
            if (response.length >= 1) {
                $scope.dadosLivros = response;
            } else {
                toastr.error('Este usuário não avaliou nenhum livro!');
            }
        }).error(function(error){
            toastr.error('Não foi possível realizar a pesquisa!');
        });


        $scope.opiniao = intLinha.observacao_opiniao;
    };

    $scope.pesquisarUsuarios = function() {
        $scope.dadosPesquisa = $filter('filter')($scope.dadosLivros, $scope.opcaoBusca);
        $scope.gridOptions1.data = $scope.dadosPesquisa;
    };

    $scope.carregaLivros();
});

app.controller('relatoriosUsuariosController', function ($scope, $rootScope, BASEURL, $window, $http, $timeout, $filter, toastr) {

    $scope.carregaUsuarios = function(){
        var strUrl = BASEURL + 'users/avg';
        $http.post(strUrl).success(function(response){
            if (response.length >= 1) {
                $scope.showDiv = true;
                $scope.dadosUsuarios = response;
                $scope.gridOptions1.data = response;
            } else {
                toastr.error('Não existe nenhum usuário cadastrado!');
            }
        }).error(function(error){
            toastr.error('Não foi possível realizar a pesquisa!');
        });
    };

    $scope.gridOptions1 = {
        enableSorting: true,
        paginationPageSizes: [10, 50, 75],
        paginationPageSize: 10,
        enableVerticalScrollbar: 0,
        rowHeight:35,
        columnDefs: [
            { field: 'id_usuario', displayName: 'Código'},
            { field: 'nome_usuario', displayName: 'Nome' },
            { field: 'media', displayName: 'Nota Média' },
            { displayName:'Lista de livros', name: ' ', enableColumnMenu: false, cellTemplate:'<a role="button" class="table-icon" data-tipo="Livros" ng-click="grid.appScope.modalInserirEditar(row.entity);"><i class="fa fa-search-plus" aria-hidden="true"></i></a>'},
        ]
    };

    $scope.modalInserirEditar = function(intLinha){
        $scope.dadosLivros = '';
        var strUrl = BASEURL + 'Books/find';
        var data = {'id_usuario': intLinha.id_usuario}
        $http.post(strUrl, data).success(function(response){
            if (response.length >= 1) {
                $('#modalInserirEditar').modal('toggle');
                $scope.dadosLivros = response;
            } else {
                toastr.error('Este usuário não avaliou nenhum livro!');
            }
        }).error(function(error){
            toastr.error('Não foi possível realizar a pesquisa!');
        });

        $scope.opiniao = intLinha.observacao_opiniao;
    };

    $scope.pesquisarUsuarios = function() {
        $scope.dadosPesquisa = $filter('filter')($scope.dadosUsuarios, $scope.opcaoBusca);
        $scope.gridOptions1.data = $scope.dadosPesquisa;
    };

    $scope.carregaUsuarios();
});

app.controller('usuarioController', function ($scope, BASEURL, $http, $filter, toastr) {

    $scope.showDiv = false;

    $scope.carregaUsuarios = function(){
        var strUrl = BASEURL + 'users';
        $http.put(strUrl).success(function(response){
            if (response.length >= 1) {
                $scope.dadosUsuarios = response
                angular.forEach($scope.dadosUsuarios, function(key, value){
                    key.nivel_usuario = key.nivel_usuario;
                    key.nivelExibicao = $scope.retornarDescricaoNivel(key.nivel_usuario);
                    key.ativo_usuario = key.ativo_usuario;
                    key.ativoExibicao = $scope.retornarDescricaoStatus(key.ativo_usuario);
                });
                $scope.gridOptions1.data = $scope.dadosUsuarios;
            } else {
                toastr.error('Não existe nenhum usuário cadastrado!');
            }
        }).error(function(error){
            toastr.error('Não foi possível realizar a pesquisa!');
        });
    };

    $scope.gridOptions1 = {
        enableSorting: true,
        paginationPageSizes: [10, 50, 75],
        paginationPageSize: 10,
        enableVerticalScrollbar: 0,
        rowHeight:35,
        rowTemplate:'<div ng-class="{ inativo : row.entity.ativo_usuario==0 }"> <div ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div></div>',
        columnDefs: [
            { name: ' ', enableColumnMenu: false, cellTemplate:'<a role="button" data-toggle="modal" data-target="#modalInserirEditar" class="table-icon" data-tipo="Editar" ng-click="grid.appScope.modalAlterarUsuario(row.entity);"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>', width: 30 },
            { field: 'nome_usuario', displayName: 'Nome'},
            { field: 'login_usuario', displayName: 'Login' },
            { field: 'email_usuario', displayName: 'Email', width:200 },
            { field: 'ativoExibicao', displayName: 'Ativo', width:110 }
        ]
    };

    $scope.pesquisarUsuarios = function() {
        $scope.showDiv = true;
        if (($scope.opcaoBusca === undefined) || ($scope.opcaoBusca === '')){
            $scope.carregaUsuarios();
        }else if(($scope.opcaoBusca !== undefined || $scope.opcaoBusca !== '') && ($scope.gridOptions1.data === '' || $scope.gridOptions1.data === undefined)){
            var strUrl = BASEURL + 'users';
            $http.put(strUrl).success(function(response){
                if (response.length >= 1) {
                    $scope.dadosUsuarios = response
                    angular.forEach($scope.dadosUsuarios, function(key, value){
                        key.nivel_usuario = key.nivel_usuario;
                        key.nivelExibicao = $scope.retornarDescricaoNivel(key.nivel_usuario);
                        key.ativo_usuario = key.ativo_usuario;
                        key.ativoExibicao = $scope.retornarDescricaoStatus(key.ativo_usuario);
                    });
                    $scope.dadosUsuariosCopy = angular.copy($scope.dadosUsuarios);
                    $scope.opcaoBuscaCopy = angular.copy($scope.opcaoBusca);
                    $scope.dadosUsuariosCopy = $filter('filter')($scope.dadosUsuariosCopy, $scope.opcaoBuscaCopy);
                    $scope.gridOptions1.data = $scope.dadosUsuariosCopy;

                } else {
                    toastr.error('Não foi possível carregar os dados, tente novamente mais tarde!');
                }
            }).error(function(error){
                toastr.error('Não foi possível realizar a pesquisa!');
            });


        }else{
            $scope.dadosUsuariosCopy = angular.copy($scope.dadosUsuarios);
            $scope.opcaoBuscaCopy = angular.copy($scope.opcaoBusca);
            $scope.dadosUsuariosCopy = $filter('filter')($scope.dadosUsuariosCopy, $scope.opcaoBuscaCopy);
            $scope.gridOptions1.data = $scope.dadosUsuariosCopy;
        }
    };

    $scope.cadastrarUsuario = function(){
        if ($scope.cadastro.strSenha.length < 6){
            toastr.error('Erro ao cadastrar o usuário: A senha digitada deve conter ao menos 6 caracteres!');
        }else if ($scope.cadastro.strSenha !== $scope.cadastro.strSenhaConfirma){
            toastr.error('Erro ao cadastrar o usuário: As senhas digitadas devem ser iguais!');
        }else if ($scope.cadastro.strNome.length > 50){
            toastr.error('O numero máximo de caracteres para o nome é de 50.');
        }else if ($scope.cadastro.strEmail.length > 50){
            toastr.error('O numero máximo de caracteres para o nome é de 50.');
        }else if ($scope.cadastro.strLogin.length > 30){
            toastr.error('O numero máximo de caracteres para o login é de 30.');
        }else if ($scope.cadastro.strLogin.indexOf(" ") >= 1){
            toastr.error('O login não pode conter espaços.');
        }else{
            var strUrl = BASEURL + 'users/register';
            var data = $scope.cadastro;
            $http.post(strUrl, data).success(function(response){
              if (response.affectedRows == 1) {
                  toastr.success('Usuário cadastrado com sucesso!');
                  $scope.carregaUsuarios();
                  $('#modalInserirEditar').modal('toggle');
              } else{
                toastr.error('Não foi possivel cadastrar o usuário!');
              }
            }).error(function(error){
              toastr.error('Erro ao cadastrar o usuário!');
            });
        }
    };

    $scope.modalAlterarUsuario = function(intLinha){
        $scope.cadastro =  {
            'intUsuario': intLinha.id_usuario,
            'blnAtivo': intLinha.ativo_usuario,
            'strSenha': '',
            'strSenhaConfirma': '',
            'strLogin': intLinha.login_usuario,
            'strNome': intLinha.nome_usuario,
            'strEmail': intLinha.email_usuario,
            'intNivel': intLinha.nivel_usuario,
            'intOpcao': '1'
        };
    };

    $scope.opcaoUsuario = function(intOpcao){
        if (intOpcao === "1"){
            $scope.alterarUsuario();
        }else{
            $scope.cadastrarUsuario();
        }
    };

    $scope.opcaoUsuarioCadastro = function(intOpcao){
        $scope.cadastro =  {
            'blnAtivo': '0',
            'strSenha': '',
            'strSenhaConfirma': '',
            'intNivel': '',
            'strLogin': '',
            'strNome': '',
            'strEmail': '',
            'intOpcao': '0'
        };
    };

    $scope.alterarUsuario = function(){
        if ($scope.cadastro.strSenha && $scope.cadastro.strSenha.length < 6){
            toastr.error('Erro ao alterar o usuário: A senha digitada deve conter ao menos 6 caracteres!');
        }
        else if (($scope.cadastro.strSenha) && ($scope.cadastro.strSenha !== $scope.cadastro.strSenhaConfirma)){
            toastr.error('Erro ao alterar o usuário: As senhas digitadas devem ser iguais!');
        }else{
            var strUrl = BASEURL + 'users/update';
            var data = $scope.cadastro;
            $http.post(strUrl, data).success(function(response){
                if (response.affectedRows == 1) {
                    toastr.success('Usuário alterado com sucesso!');
                    $scope.carregaUsuarios();
                    $('#modalInserirEditar').modal('toggle');
                } else {
                    toastr.error('Não foi possível alterar o usuário!');
                }
            }).error(function(error){
                toastr.error('Não foi possível alterar o usuário!');
            });
        }
    };

    $scope.retornarDescricaoNivel = function(intNivel){
        intNivel = parseInt(intNivel);
        if(intNivel === 1 ){
            return 'Administrador';
        } else {
            return 'Básico';
        }
    };

    $scope.retornarDescricaoStatus = function(intStatus){
        intStatus = parseInt(intStatus);
        if(intStatus === 1){
            return "Inativo";
        }else{
            return 'Ativo';
        }
    };

    $scope.pesquisarUsuarios();
});
