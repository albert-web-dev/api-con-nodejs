'use strict'

const validator = require('validator');
const ModeloApi = require('../modelo/myapimodel');
var fs = require('fs');
const path = require('path');

var controller = {
    getRegistros: (req, res)=>{
        var query = ModeloApi.find({});
        query.sort('-_id').exec((err, registros)=>{
            if(err || !registros){
                return res.status(500).send({
                    status: 'Error',
                    message: 'Error en la consulta'
                });
            }else{
                return res.status(200).send({
                    status: 'success',
                    registros
                });
            }
        });
    },
    getRegistro: (req, res)=>{
        var IdRegistro = req.params.id;
        
        ModeloApi.findById(IdRegistro, (err, registro)=>{
            if(err || !registro){
                return res.status(500).send({
                    status: 'Error',
                    message: 'error al mostrar el registro.'
                });
            }else{
                return res.status(500).send({
                    status: 'Success',
                    registro
                });
            }
        });
    },
    save: (req, res) =>{
        var params = req.body;

        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_description = !validator.isEmpty(params.description);
        }catch(err){
            return res.status(500).send({
                status: 'Error',
                message: 'Faltan datos'
            });
        }

        if(validate_title && validate_content && validate_description){
            //
            let Modelo = new ModeloApi;
            //asignar valores
            Modelo.title = params.title;
            Modelo.content = params.content;
            Modelo.description = params.description;
            Modelo.image = null;
            
            //guardar
            Modelo.save((err, regStored)=>{
                if(err || !regStored){
                    return res.status(404).send({
                        status: 'Error',
                        message: 'Error al guardar'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    message: 'registro guardardado con éxito.',
                    regStored
                });
            });
        }else{
            return res.status(500).send({
                status: 'Error',
                message: 'Los datos no son validos'
            });
        }
    },
    update: (req, res)=>{
        //recoger articulo que viene por la url
        let Id = req.params.id;

        //recoge los datos que llegan por put
        let params = req.body;
        
        //validar datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_description = !validator.isEmpty(params.description);
            var validate_content = !validator.isEmpty(params.content);
        } catch (error) {
            return res.status(500).send({
                status: 'Error',
                message: 'Faltan parametros'
            });
        }

        //actualizar
        if(validate_title || validate_description || validate_content){
            ModeloApi.findOneAndUpdate({_id: Id}, params,{new: true}, (err, registroUpdated)=>{
                if(err || !registroUpdated){
                    return res.status(500).send({
                        status: 'Error',
                        message: 'No se pudo hacer la actualización.'
                    }); 
                }else{
                    return res.status(200).send({
                        status: 'Success',
                        registroUpdated
                    });
                }
            });
        }
    },
    delete: (req, res)=>{
        //recoger el ID de la URL
        var deleteId = req.params.id;

        //find and delete
        ModeloApi.findOneAndDelete({_id: deleteId}, (err, registroDeleted)=>{
            if(err || !registroDeleted){
                return res.status(500).send({
                    status: 'Error',
                    message: 'No se pudo eliminar el registro.'
                });
            }else{
                return res.status(200).send({
                    status: 'Success',
                    registroDeleted
                });
            }
        });
    },
    upload: (req, res)=>{
        //recoger fichero de peticion
        if(!req.files){
            return res.status(200).send({
                status: 'Error',
                message: 'imagen no subida'
            });
        }

        //conseguir nombre y extención del archivo
        let file_path = req.files.image0.path;
        let file_split = (file_path.split('\\'));
        let file_name = file_split[2];
        //extención
        let extencion = file_name.split('\.');
        let file_ext = extencion[1];

        //comprovar extención y borrar archivo en caso de no ser una extención valida
        if(file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'png' && file_ext != 'gif' && file_ext != 'svg'){
            fs.unlink(file_path, (err)=>{
                return res.status(500).send({
                    status: 'Error',
                    message: 'El archivo que intentas subir no tiene una extención valida.'
                });
            });
        }else{
            //buscar registro, asignarle imagen y actualizarlo
            let IdRegistro = req.params.id;
            ModeloApi.findOneAndUpdate({_id: IdRegistro}, {image: file_name}, {new:true}, (err, regisUpdated)=>{
                if(err || !regisUpdated){
                    return res.status(200).send({
                        status: 'Error',
                        message: 'El articulo no se pudo actualizar'
                    }); 
                }else{
                    return res.status(200).send({
                        status: 'Success',
                        regisUpdated
                    });
                }
            });
        }
    },
    search: (req, res)=>{
        //sacar el string a buscar
        var searchString = req.params.search;

        //find or
        ModeloApi.find({"$or": [
            { "title": { "$regex": searchString, "$options": "i"}},
            { "content": { "$regex": searchString, "$options": "i"}}
        ]})
        .sort([['date', 'descending']])
        .exec((err, registros)=>{
            if(err){
                return res.status(500).send({
                    status: 'Error',
                    message: 'Error en la petición.'
                });
            }
            if(!registros || registros.length <= 0){
                return res.status(404).send({
                    status: 'Error',
                    message: 'No hay articulos que coincidan con tu busqueda.'
                });
            }
            return res.status(200).send({
                status: 'Succes',
                registros
            });
        });
    }
}; //end controller

module.exports = controller;