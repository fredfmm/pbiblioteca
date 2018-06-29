var express = require('express');
var config = require('../config/config');
var jwt = require('jsonwebtoken');
var router = express.Router();
var Review = require('../models/Review');
var VerifyToken = require('../config/VerifyToken');

router.post('/', VerifyToken, function(req, res, next){
        //retorna o relatório geral de avaliações
        Review.getAllFiles(function(err, rows) {
            if(err)
            {
                res.json(err);
            }
            else{
                res.json(rows);//or return count for 1 & 0
            }
        });
});

//insere a avaliação de um livro
router.post('/add', function(req, res, next) {
	Review.checkReview(req.body, function(err, count) {
		if (err) {
			res.json(err);
		} else {
			if (count.length === 0) {
				Review.addReview(req.body, function(err, count) {
					if (err) {
						res.json(err);
					} else {
						res.json(count); //or return count for 1 & 0
					}
				});
			} else {
				res.json(count);
			}
		}
	});
});

module.exports=router;
