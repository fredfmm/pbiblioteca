var db = require('../config/dbconnection');

var Book = {

	getAllBooks: function(callback) {

		return db.query("Select * from tab_livro where ativo_livro = 0", callback);
	},
	getAllBooksList: function(callback) {

		return db.query("Select * from tab_livro", callback);
	},
	getAllState: function(callback) {

		return db.query("Select * from tab_estado", callback);
	},
	getBookById: function(id, callback) {

		return db.query("select * from tab_livro where id_livro=? and ativo_livro = 0", [id], callback);
	},
	findBook: function(id, callback) {

		return db.query("select * from tab_livro inner join tab_opiniao on livro_opiniao = id_livro where usuario_opiniao = ? and ativo_livro = 0", [id], callback);
	},
	findBookNotes: function(callback) {

		return db.query("select id_livro, nome_livro, id_opiniao, estado_opiniao from tab_livro left join tab_opiniao on id_livro = livro_opiniao where ativo_livro = 0", callback);
	},
	deleteBook: function(id, callback) {

		return db.query("delete from tab_livro where id_livro=?", [id], callback);
	},
	updateBook: function(Book, callback) {

		return db.query("update tab_livro set nome_livro=?,autor_livro=?, editora_livro=?, ano_livro=?, ativo_livro=? where id_livro=?", [Book.strTitulo, Book.strAutor, Book.strEditora, Book.strAno, Book.blnAtivo, Book.intLivro], callback);
	},
	insertBook: function(Book, callback) {

		return db.query("insert into tab_livro (nome_livro, autor_livro, editora_livro, ano_livro, ativo_livro) values (?,?,?,?,?)", [Book.strTitulo, Book.strAutor, Book.strEditora, Book.strAno, Book.blnAtivo], callback);
	},
	countBook: function(callback) {

		return db.query("Select count(*) as totalLivros from tab_livro where ativo_livro = 0", callback);
	}
};
module.exports = Book;
