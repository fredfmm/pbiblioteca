var db = require('../config/dbconnection');

var User = {

	getAllUsers: function(callback) {

		return db.query("Select * from tab_usuario where ativo_usuario = 0", callback);

	},
	getAllUsersList: function(callback) {

		return db.query("Select * from tab_usuario", callback);

	},
	getUserByName: function(name, callback) {

		return db.query("select * from tab_usuario where login_usuario = ?", [name], callback);
	},
	getUserPass: function(name, callback) {

		return db.query("select * from tab_usuario where nivel_usuario = 1 and ativo_usuario = 0 and login_usuario = ?", [name], callback);
	},
	getUserPassId: function(id, callback) {

		return db.query("select * from tab_usuario where nivel_usuario = 1 and id_usuario = ?", [id], callback);
	},
	setUser: function(user, pass, callback) {

		return db.query("insert into tab_usuario (login_usuario, email_usuario, nome_usuario, nivel_usuario, senha_usuario, ativo_usuario) values (?,?,?,?,?,?)", [user.strLogin, user.strEmail, user.strNome, user.intNivel, pass, user.blnAtivo], callback);
	},
	updateUser: function(user, callback) {

		return db.query("update tab_usuario set login_usuario = ?, email_usuario= ?, nome_usuario = ?, nivel_usuario = ?, ativo_usuario = ? where id_usuario = ?", [user.strLogin, user.strEmail, user.strNome, user.intNivel, user.blnAtivo, user.intUsuario], callback);
	},
	updateUserPass: function(user, pass, callback) {

		return db.query("update tab_usuario set login_usuario = ?, email_usuario= ?, nome_usuario = ?, nivel_usuario = ?, senha_usuario = ?, ativo_usuario = ? where id_usuario = ?", [user.strLogin, user.strEmail, user.strNome, user.intNivel, pass, user.blnAtivo, user.intUsuario], callback);
	},
	updatePass: function(user, pass, callback) {

		return db.query("update tab_usuario set senha_usuario = ? where id_usuario = ?", [pass, user], callback);
	},
	countUser: function(callback) {
		return db.query("Select count(*) as totalUsuarios from tab_usuario where ativo_usuario = 0", callback);
	},
	getUserAvg: function(callback) {

		return db.query("SELECT id_usuario, nome_usuario, if(AVG(nota_opiniao), AVG(nota_opiniao), 0) as media FROM (select id_usuario, nome_usuario, nota_opiniao from tab_usuario left join tab_opiniao on usuario_opiniao = id_usuario where ativo_usuario = 0) AS subquery GROUP BY id_usuario", callback);
	}
};
module.exports = User;
