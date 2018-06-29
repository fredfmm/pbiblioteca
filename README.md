# **LEIA-ME** #
Informações importantes do projeto biblioteca.

## **Informações importantes** ##
Embora utilizado, não é necessário um servidor Apache para executar este projeto, ao longo deste documento é descrito como executar a aplicação

## **Ambiente de desenvolvimento** ##

* Sistema Operacional [Ubuntu version 18.04.1]
* Banco de dados [Mysql version 5.7.22]
* Servidor [Server version: Apache/2.2.14]
* Node.js [version 8.11.3]
* NPM package manager [version 5.6.0]
* GULP toolkit [version 3.9.1]

## **Frameworks** ##

* [AngularJS 1.5.x]
* [Express 4.13.x]

## **Estrutura** ##

* **Front**
```
www/                     - Raiz da aplicação.
    css/                 - Arquivos de Estilo.
    fonts/               - Fontes.
    js/                  - Arquivos principais da aplicação (app.js).
    js/controllers/      - Controladores da Aplicação.
    js/lib/              - Bibliotecas utilizadas na aplicação (Ex. chartjs).
    pages/               - Modelos das Views (Arquivos .html).
       - Modelos das Views (Arquivos .html).
```
* **Back**
```
nodeApi/                - Raiz da aplicação.
    bin/                - Arquivos de configurações módulo servidor HTTP.
    config/             - Arquivos de configurações.
    Models/             - Arquivos de manipulação de dados.
    routes/             - Arquivos de rotas.
    app.js              - Modulo principal da aplicação

```

## **Como faço funcionar o Front-end?** ##

É muito simples!
Para executar este projeto é necessário o NodeJs e NPM.


Windows: Utilizando o Mingw-w64 (GCC compiler on Windows system) basta seguir os mesmos passos descritos para o SO Ubuntu.

Ubuntu:

A partir do diretório raiz:
```
$ cd /var/www/html/
```
Execute o seguinte comando no terminal:
```
$ git clone git@github.com:fredfmm/pbiblioteca.git
```
Entre na pasta raiz do projeto:
```
$ cd /var/www/html/pbiblioteca
```
Execute o comando:
```
$ npm install
```
Após concluir a instalação, execute o comando:
```
$ gulp build
```
Nesta etapa será criada a pasta www/ com a aplicação pronta para produção.
o Gulp build executa uma sequencia tarefas preparando os arquivos para produção
Em app/ é a aplicação em ambiente de desenvolvimento.

Em desenvolvimento é necessário executar o comando
```
$ gulp
```
que monitora as modificações em app/

Nesta etapa a aplicação view (front-end) está pronta.

Também podemos executá-la com o comando
```
$ npm start
```

## **Como faço funcionar o Back-end?** ##

É muito simples!
Para executar este projeto é necessário o NodeJs e NPM.


Windows: Utilizando o Mingw-w64 (GCC compiler on Windows system) basta seguir os mesmos passos descritos para o SO Ubuntu.

Ubuntu:

A partir do diretório raiz:
```
$ cd /var/www/html/
```
Execute o seguinte comando no terminal:
```
$ git clone git@github.com:fredfmm/pbiblioteca.git
```
Entre na pasta do projeto:
```
$ cd /var/www/html/pbiblioteca/nodeApi
```
Execute o comando:
```
$ npm install
```
Após concluir a instalação, execute o comando:
```
$ node start
```
ou
```
$ node bin/www &
```
Pronto a aplicação já está pronta e rodando em http://127.0.0.1:3001/

# **Observação** #

Todas as requisições devem possuir o seguinte header:

**Content-Type application/json**

Com exceção do /login e rotas utilizadas em /registro as demais url's também precisam ter o header:

**x-access-token <token gerado no login>**

Se a URL da API for alterada é necessário realizar a alteração em app/views/js/app.js
na seguinte linha:
** 26 -- app.constant('BASEURL', 'http://127.0.0.1:3001/');**


# **Considerações Finais** #

Na raiz do projeto existe um arquivo chamado **.gitignore** (no Ubuntu pressione as teclas Ctrl + H para ele aparecer).
onde o mesmo faz com que o git ignore as pastas:
  **composer.phar**
  **/vendor/**
  **/node_modules/**
  **/nodeApi/node_modules/**
  **/src/**
  **/www/**
