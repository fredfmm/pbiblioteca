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
