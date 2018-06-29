var db = require('../config/dbconnection');

var Review = {

	getAllFiles: function(callback) {
		var sql = "";
		sql = sql + "select ";
		sql = sql + "tlo.id_opiniao, ";
		sql = sql + "tlo.livro_opiniao, ";
		sql = sql + "tl.nome_livro, ";
		sql = sql + "tlo.estado_opiniao, ";
		sql = sql + "tlo.nota_opiniao, ";
		sql = sql + "tlo.observacao_opiniao, ";
		sql = sql + "tlo.usuario_opiniao, ";
		sql = sql + "tu.nome_usuario, ";
		sql = sql + "te.nome_estado as estadoExibicao ";
		sql = sql + "from tab_opiniao as tlo ";
		sql = sql + "inner join tab_livro as tl on tl.id_livro = tlo.livro_opiniao ";
		sql = sql + "inner join tab_usuario as tu on tu.id_usuario = tlo.usuario_opiniao ";
		sql = sql + "inner join tab_estado as te on te.id_estado = tlo.estado_opiniao ";
		sql = sql + "where tl.ativo_livro = 0 and tu.ativo_usuario = 0";
		return db.query(sql, callback);
	},
	addReview: function(Book, callback) {

		return db.query("insert into tab_opiniao (livro_opiniao,estado_opiniao,nota_opiniao,observacao_opiniao,usuario_opiniao) values(?,?,?,?,?)",[Book.livro_opiniao, Book.estado_opiniao, Book.nota_opiniao, Book.observacao_opiniao, Book.usuario_opiniao],callback);
	},
	checkReview: function(Book, callback) {

		return db.query("select * from tab_opiniao where livro_opiniao = ? and usuario_opiniao = ?", [Book.livro_opiniao, Book.usuario_opiniao], callback);
	}
};
module.exports = Review;
