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
