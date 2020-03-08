'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ArticuloSchema = Schema({
    title: String,
    description: String,
    content: String,
    date: {type: Date, default: Date.now},
    image: String
});

module.exports = mongoose.model('Articulo', ArticuloSchema);