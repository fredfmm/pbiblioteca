var express = require('express');
var config = require('../config/config');
var jwt = require('jsonwebtoken');
var VerifyToken = require('../config/VerifyToken');
var router = express.Router();
var Book = require('../models/Book');

//retorna a lista de livros
router.get('/:id?', function(req, res, next) {
	if (req.params.id) {
		Book.getBookById(req.params.id, function(err, rows) {
			if (err) {
				res.json(err);
			} else {
				res.json(rows);
			}
		});
	} else {
		Book.getAllBooks(function(err, rows) {
			if (err) {
				res.json(err);
			} else {
				res.json(rows);
			}
		});
	}
});

//retorna a lista de livros ignorando o status inativo
router.put('/', VerifyToken, function(req, res, next) {
		Book.getAllBooksList(function(err, rows) {
			if (err) {
				res.json(err);
			} else {
				res.json(rows);
			}
		});
});

//retorna a lista de estado de conservacao
router.post('/cons', function(req, res, next) {
		Book.getAllState(function(err, rows) {
			if (err) {
				res.json(err);
			} else {
				res.json(rows);
			}
		});
});

// retorna todos os livros que um determinado usuario avaliou
router.post('/find', VerifyToken, function(req, res, next) {
	Book.findBook(req.body.id_usuario, function(err, rows) {
		if (err) {
			res.json(err);
		} else {
			res.json(rows);
		}
	});
});

// retorna todos os livros com o numero de avaliações
router.post('/notes', VerifyToken, function(req, res, next) {
	Book.findBookNotes(function(err, rows) {
		if (err) {
			res.json(err);
		} else {
			res.json(rows);
		}
	});
});

// realiza o update dos dados do livro
router.post('/update', VerifyToken, function(req, res, next) {
	Book.updateBook(req.body, function(err, rows) {
		if (err) {
			res.json(err);
		} else {
			res.json(rows);
		}
	});
});

// realiza o insert dos dados do livro
router.post('/insert', VerifyToken, function(req, res, next) {
	Book.insertBook(req.body, function(err, rows) {
		if (err) {
			res.json(err);
		} else {
			res.json(rows);
		}
	});
});

// retorna o total de livros cadastrados
router.post('/count', VerifyToken, function(req, res, next) {
	Book.countBook(function(err, rows) {
		if (err) {
			res.json(err);
		} else {
			res.json(rows);
		}
	});
});

router.post('/:id', function(req, res, next) {
	Book.deleteAll(req.body, function(err, count) {
		if (err) {
			res.json(err);
		} else {
			res.json(count);
		}
	});
});

router.delete('/:id', function(req, res, next) {
	Book.deleteBook(req.params.id, function(err, count) {
		if (err) {
			res.json(err);
		} else {
			res.json(count);
		}

	});
});


module.exports = router;
