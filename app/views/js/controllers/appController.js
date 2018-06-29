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
