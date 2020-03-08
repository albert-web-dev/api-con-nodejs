'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

//rutas
const api_routes = require('./rutas/myapiroute');

//middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(api_routes)

module.exports = app;