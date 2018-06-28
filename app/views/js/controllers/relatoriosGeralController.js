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
