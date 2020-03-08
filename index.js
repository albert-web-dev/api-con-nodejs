'use strict'

const mongoose = require('mongoose');
const app = require('./app');

const port = 3001;

//conexion con mongo
mongoose.set('useFindAndModify', true);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/apiportfolio', {useNewUrlParser: true})
        .then(()=>{
            console.log("conexión exitosa");
            app.listen(port, ()=>{
                console.log("servidor corriendo en URL: http://localhost:3001");
            });
        })
        .catch(err => console.log(err));