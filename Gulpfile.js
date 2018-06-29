/**
 * Dependências necessárias pelo Node.JS para executar as tarefas.
 */
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var ngAnnotate = require('gulp-ng-annotate');
var copy = require('gulp-copy');
var clean = require('gulp-clean');
var deleteEmpty = require('delete-empty');
var runSequence = require('run-sequence');
var babel = require('gulp-babel');
var htmlreplace = require('gulp-html-replace');
// var componentes = 'node_modules/';
// var componentesBower = 'app/views/lib/';
var componentes = 'app/views/css/';
var componentesJs = 'app/views/js/';

/**
 * Tarefa que copia os arquivos de fonte
 */
gulp.task('copia-fontes', function () {
    gulp.src('app/views/fonts/*.*')
        .pipe(gulp.dest('app/views/fonts'));
});

/**
 * Arquivos de bibliotecas baixadas com o Bower
 */
arquivosJs = [
    componentesJs + 'lib/jquery.min.js',
    componentesJs + 'lib/angular.min.js',
    componentesJs + 'lib/angular-route.min.js',
    componentesJs + 'lib/angular-locale_pt-br.js',
    componentesJs + 'lib/angular-touch.js',
    componentesJs + 'lib/angular-animate.js',
    componentesJs + 'lib/angular-input-masks/ngMask.min.js',
    componentesJs + 'lib/jquery.maskedinput.min.js',
    componentesJs + 'lib/angular-input-masks/angular-input-masks-dependencies.js',
    componentesJs + 'lib/angular-input-masks/angular-input-masks.br.js',
    componentes + 'vendor/bootstrap/js/bootstrap.min.js',
    componentes + 'vendor/metisMenu/metisMenu.min.js',
    componentes + 'dist/js/admin.js',
    componentesJs + 'lib/moment.min.js',
    componentesJs + 'lib/moment-pt-br.js',
    componentesJs + 'lib/bootstrap-datetimepicker.min.js',
    componentesJs + 'lib/angular-block-ui.min.js',
    componentesJs + 'lib/ui-grid.min.js',
    componentesJs + 'lib/perfect-scrollbar.min.js',
    componentesJs + 'lib/angular-perfect-scrollbar.js',
    componentesJs + 'lib/angular-toastr.tpls.min.js',
];

/**
 * Tarefa que concatena as bibliotecas em um unico arquivo
 */
gulp.task('bower-lib', function () {
    gulp.src(arquivosJs)
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest('app/views/lib'));
});

/**
 * Pastas com os arquivos de css
 */
arquivosCss = [
    componentes + 'vendor/bootstrap/css/bootstrap.min.css',
    componentes + 'lib/bootstrap-datetimepicker.min.css',
    componentes + 'lib/angular-block-ui.min.css',
    componentes + 'lib/angular-toastr.min.css',
    componentes + 'lib/ui-grid.min.css',
    componentes + 'principal.css',
    componentes + 'vendor/metisMenu/metisMenu.min.css',
    componentes + 'dist/css/admin.css',
    componentes + 'vendor/font-awesome/css/font-awesome.min.css'
];

/**
 * Tarefa que concatena e minifica os arquivos css
 */
gulp.task('minify-css', function () {
    gulp.src(arquivosCss)
        .pipe(concat('estilo.min.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('app/views/css'));
});

/**
 * Arquivos de código fonte
 */
arquivos = [
    'app/views/js/app.js',
    'app/views/js/controllers/*.js'
];

/**
 * Tarefa que concatena e minifica os arquivos no app.min.js
 *
 * 'babel' necessário para o 'uglify' funcionar com a sintaxe es6.
 */
gulp.task('minify', function () {
    gulp.src(arquivos)
        .pipe(babel({
                presets: ['es2015']
            }))
        .pipe(concat('app.min.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('app/views'));
});

/**
 * Tarefa que copia os arquivos para a pasta de produção (Não versionada)
 */
gulp.task('build-src', function () {
    return gulp.src(['app/views/**'])
               .pipe(gulp.dest('www'));
});

/**
 * Troca o 'app-app/views.js' para 'app.min.js' para produção.
 */
gulp.task('app-prod', function () {
    return gulp.src(['www/index.html'])
               .pipe(htmlreplace({appjs: 'app.min.js'}))
               .pipe(gulp.dest('www'));
});

/**
 * Tarefa que remove os arquivos que não devem ir para produção.
 */
gulp.task('clean-build', function () {
    return gulp.src([
        'www/app-desenv.js',
        'www/componentes/**/*.js',
        'www/modulos/**/*.js',
        'www/css/*.css',
        'www/js/*',
        'www/lib/*',
        '!www/lib/vendor.min.js',
        '!www/css/estilo.min.css',
        '!www/modulos/modulos.min.js',
        'www/bower_components',
        'www/README.md',
        'www/bower.json'
    ], {read: false})
               .pipe(clean());
});

/**
 * Tarefa que concatena os arquivos no app-desenv.js
 */
gulp.task('concat-desenv', function () {
    gulp.src(arquivos)
        .pipe(concat('app-desenv.js'))
        .pipe(gulp.dest('app/views'));
});

/**
 * Compila o sistema para produção
 */
gulp.task('build', function () {
    runSequence('minify', 'build-src', 'app-prod', 'clean-build', function() {
        deleteEmpty('www/', function(done){

        });
    });
});

/**
 * Executa o 'Watcher' para minificar os arquivos do sistema.
 */
gulp.task('default', function () {
    gulp.watch(arquivos, ['concat-desenv']);
    gulp.watch(arquivosCss, ['minify-css']);
    gulp.watch(arquivosCss, ['minify']);
    // gulp.watch(arquivosJs, ['bower-lib']);
});
