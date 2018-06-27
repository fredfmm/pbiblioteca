app.controller('livrosController', function ($scope, BASEURL, $http, $filter, toastr) {

    $scope.showDiv = false;

    $scope.carregaLivros = function(){
        var strUrl = BASEURL + 'Books';
        $http.get(strUrl).success(function(response){
            console.log(response)
            if (response.length >= 1) {
                $scope.dadosLivros = response
                angular.forEach($scope.dadosLivros, function(key, value){
                    key.ativoExibicao = $scope.retornarDescricaoStatus(key.ativo_livro);
                    key.disponivelExibicao = $scope.retornarDispoStatus(key.disponivel_livro);
                });
                $scope.gridOptions1.data = $scope.dadosLivros;
            } else {
                toastr.error('Não existe nenhum livro cadastrado!');
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
        rowTemplate:'<div ng-class="{ inativo : row.entity.ativo_livro==0 }"> <div ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div></div>',
        columnDefs: [
            { name: ' ', enableColumnMenu: false, cellTemplate:'<a role="button" data-toggle="modal" data-target="#modalInserirEditar" class="table-icon" data-tipo="Editar" ng-click="grid.appScope.modalAlterarLivro(row.entity);"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>', width: 30 },
            { field: 'id_livro', displayName: 'Código'},
            { field: 'nome_livro', displayName: 'Título'},
            { field: 'autor_livro', displayName: 'Autor' },
            { field: 'editora_livro', displayName: 'Editora' },
            { field: 'ano_livro', displayName: 'Ano' },
            { field: 'ativoExibicao', displayName: 'Status' },
            { field: 'disponivelExibicao', displayName: 'Disponibilidade' }
        ]
    };

    $scope.pesquisarLivros = function() {
        $scope.showDiv = true;
        if (($scope.opcaoBusca === undefined) || ($scope.opcaoBusca === '')){
            $scope.carregaLivros();
        }else if(($scope.opcaoBusca !== undefined || $scope.opcaoBusca !== '') && ($scope.gridOptions1.data === '' || $scope.gridOptions1.data === undefined)){
            var strUrl = BASEURL + 'Books';
            $http.get(strUrl).success(function(response){
                if (response.length >= 1) {
                    $scope.dadosLivros = angular.copy(response);
                    angular.forEach($scope.dadosLivros, function(key, value){
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
            }).error(function(error){
                toastr.error('Não foi possível realizar a pesquisa!');
            });
        }else{
            $scope.dadosLivrosCopy = angular.copy($scope.dadosLivros);
            $scope.opcaoBuscaCopy = angular.copy($scope.opcaoBusca);
            $scope.dadosLivrosCopy = $filter('filter')($scope.dadosLivrosCopy, $scope.opcaoBuscaCopy);
            $scope.gridOptions1.data = $scope.dadosLivrosCopy;
        }
    };

    $scope.cadastrarLivro = function(){
        if ($scope.cadastro.strTitulo.length > 50){
            toastr.error('O numero máximo de caracteres para o título é de 50.');
        }else if ($scope.cadastro.strAutor.length > 50){
            toastr.error('O numero máximo de caracteres para o autor é de 50.');
        }else if ($scope.cadastro.strEditora.length > 50){
            toastr.error('O numero máximo de caracteres para a editora é de 50.');
        }else if (typeof $scope.cadastro.strAno === 'number'){
            toastr.error('O ano informado não é válido.');
        }else{
            var strUrl = BASEURL + 'books/insert';
            var data = $scope.cadastro;
            console.log(data);
            $http.post(strUrl, data).success(function(response){
                console.log(response);
              if (response.affectedRows == 1) {
                  toastr.success('Livro cadastrado com sucesso!');
                  $scope.carregaLivros();
                  $('#modalInserirEditar').modal('toggle');
              } else{
                toastr.error(response.message);
              }
            }).error(function(error){
              toastr.error('Erro ao cadastrar o livro!');
            });
        }
    };

    $scope.modalAlterarLivro = function(intLinha){
        console.log(intLinha);
        $scope.cadastro =  {
            'intLivro': intLinha.id_livro,
            'blnAtivo': intLinha.ativo_livro,
            'strEditora': intLinha.editora_livro,
            'strTitulo': intLinha.nome_livro,
            'strAutor': intLinha.autor_livro,
            'strAno': intLinha.ano_livro,
            'intOpcao': '1'
        };
    };

    $scope.opcaoLivro = function(intOpcao){
        if (intOpcao === "1"){
            $scope.alterarLivro();
        }else{
            $scope.cadastrarLivro();
        }
    };

    $scope.opcaoLivroCadastro = function(intOpcao){
        $scope.cadastro =  {
            'blnAtivo': '0',
            'strEditora': '',
            'strTitulo': '',
            'strAutor': '',
            'strAno': '',
            'intOpcao': '0'
        };
    };

    $scope.alterarLivro = function(){
        if ($scope.cadastro.strTitulo.length > 50){
            toastr.error('O numero máximo de caracteres para o título é de 50.');
        }else if ($scope.cadastro.strAutor.length > 50){
            toastr.error('O numero máximo de caracteres para o autor é de 50.');
        }else if ($scope.cadastro.strEditora.length > 50){
            toastr.error('O numero máximo de caracteres para a editora é de 50.');
        }else if (typeof $scope.cadastro.strAno === 'number'){
            toastr.error('O ano informado não é válido.');
        }else{
            var strUrl = BASEURL + 'books/update';
            var data = $scope.cadastro;
                console.log(data)
            $http.post(strUrl, data).success(function(response){
                console.log(response)
                if (response.affectedRows == 1) {
                    toastr.success('Livro alterado com sucesso!');
                    $scope.carregaLivros();
                    $('#modalInserirEditar').modal('toggle');
                } else {
                    toastr.error(response.message);
                }
            }).error(function(error){
                toastr.error('Não foi possível alterar o livro!');
            });
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

    $scope.retornarDispoStatus = function(intStatus){
        intStatus = parseInt(intStatus);
        if(intStatus === 1){
            return "Emprestado";
        }else{
            return 'Disponível';
        }
    };

    $scope.pesquisarLivros();
});
