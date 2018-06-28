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
