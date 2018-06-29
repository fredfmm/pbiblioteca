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
                    var relatorioOpiniao = [];
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
