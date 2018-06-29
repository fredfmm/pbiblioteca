var express = require('express');
var config = require('../config/config');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var router = express.Router();
var User = require('../models/User');
var VerifyToken = require('../config/VerifyToken');

// retorna a lista de usuarios
router.get('/', function(req, res, next) {
	User.getAllUsers(function(err, rows) {
		if (err) {
			res.json(err);
		} else {
			res.json(rows);
		}
	});
});

// Retorna a lista de usuarios ignorando o status inativo
router.put('/', VerifyToken, function(req, res, next) {
	User.getAllUsersList(function(err, rows) {
		if (err) {
			res.json(err);
		} else {
			res.json(rows);
		}
	});
});

//retorna a lista de usuários com notas
router.post('/avg', VerifyToken, function(req, res, next) {
	User.getUserAvg(function(err, rows) {
		if (err) {
			res.json(err);
		} else {
			res.json(rows);
		}
	});
});

//retorna se o usuário existe cadastrado
router.post('/', function(req, res, next) {
	userName = req.body.strUser;
	User.getUserByName(userName, function(err, rows) {
		if (err) {
			res.json(err);
		} else {
			res.json(rows);
		}
	});
});

// 	if (err) return res.status(500).send("There was a problem finding the user.");
// 	if (!user) return res.status(404).send("No user found.");
// 	res.status(200).send(user);

//Retorna os dados do usuario e sua token
router.post('/login', function(req, res, next) {
	userName = req.body.strLogin;
	userPass = req.body.strSenha;
	User.getUserPass(userName, function(err, rows) {
		if (err) {
			res.json(err);
		} else {
			var data = rows;
			var login = 0;
			if(rows.length >= 1){
				bcrypt.compare(userPass, rows[0].senha_usuario, function(err, cet) {
					if (cet) {
						var token = jwt.sign({ data: rows }, config.secret, {
				      expiresIn: 86400 // expires in 24 hours
				    });
						var data = {
							'token': token,
							'data': rows
						}
						res.json(data);
					} else {
						res.json(err);
					}
				});
			} else{
				res.json(err);
			}
		}
	});
});

// cadastra um usuário
router.post('/register', VerifyToken, function(req, res, next) {
	User.getUserByName(req.body.strLogin, function(err, count) {
		if (err) {
			res.json(err);
		} else {
			if (count.length === 0) {
				var passUser = bcrypt.hashSync(req.body.strSenha, 10);
				User.setUser(req.body, passUser, function(err, rows) {
					if (err) {
						res.json(err);
					} else {
						res.json(rows);
					}
				});
			} else {
				res.json(count);
			}
		}
	});
});

//Atualiza um usuario
router.post('/update', VerifyToken, function(req, res, next) {
	if (req.body.strSenha == '') {
		User.updateUser(req.body, function(err, rows) {
			if (err) {
				res.json(err);
			} else {
				res.json(rows);
			}
		});
	} else {
		var passUser = bcrypt.hashSync(req.body.strSenha, 10);
		User.updateUserPass(req.body, passUser, function(err, rows) {
			if (err) {
				res.json(err);
			} else {
				res.json(rows);
			}
		});
	}
});

// retorna o total de usuarios cadastrados
router.post('/count', VerifyToken, function(req, res, next) {
	User.countUser(function(err, rows) {
		if (err) {
			res.json(err);
		} else {
			res.json(rows);
		}
	});
});

//realiza a troca de senha
router.post('/changepass', VerifyToken, function(req, res, next) {
	var idUser = req.body.idUser;
	User.getUserPassId(idUser, function(err, rows) {
		if (err) {
			res.json(err);
		} else {
			var data = rows;
			var login = 0;
			if (bcrypt.compareSync(req.body.oldPasswd, rows[0].senha_usuario)) {
				var passUser = bcrypt.hashSync(req.body.newPass, 10);
				User.updatePass(idUser, passUser, function(err, rows) {
					if (err) {
						res.json(err);
					} else {
						res.json(rows);
					}
				});
			} else {
				res.json(err);
			}
		}
	});
});

module.exports = router;
