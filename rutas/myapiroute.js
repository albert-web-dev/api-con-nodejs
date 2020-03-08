'use strict'
const express = require('express');
const ApiController = require('../controladores/myapicontroller');
const router = express.Router();

//multyparty
const multiparty = require('connect-multiparty');

//middleware
const md_upload = multiparty({ uploadDir: './upload/articles' });

//rutas
router.post('/save', ApiController.save);
router.get('/consultar/', ApiController.getRegistros);
router.get('/consulta/:id', ApiController.getRegistro);
router.put('/update/:id', ApiController.update);
router.delete('/delete/:id', ApiController.delete);
router.post('/upload-image/:id', md_upload, ApiController.upload);
router.get('/search/:search', ApiController.upload);

module.exports = router;