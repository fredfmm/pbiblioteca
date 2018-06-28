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
