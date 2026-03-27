const Sequelize = require('sequelize');
const db= require('../models')
const categoria = db.tbc_categorias;



module.exports = {
    create(req, res){
        return categoria
        .create({
            nombre: req.body.nombre
        })
        .then(categoria=>res.status(200).send(categoria))
        //.then(categoria => res.status(200).send({message: "Datos creados correctamente", categoria}))
        .catch(error => res.status(400).send(error))
    },
    list(_, res){
        return categoria.findAll({})
            .then(categoria => res.status(200).send(categoria))
            .catch(error => res.status(400).send(error))
    },
    find (req, res){
        return categoria.findAll({
            where: {
                nombre: req.params.nombre,
            }
        })
        .then(categoria => res.status(200).send(categoria))
        .catch(error => res.status(400).send(error))
    },
    update(req, res){
        return categoria.update({
            nombre: req.body.nombre
        },
        {
            where: {
                id: req.params.id         
            }
        }
    )
        .then(categoriaActualizada => res.status(200).send({message: 'Categoria actualizada correctamente', categoriaActualizada}))
        .catch(error => res.status(400).send(error));
    },
    delete(req, res){
        return categoria.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(() => res.status(200).send({message: 'Categoria eliminada correctamente'}))
        .catch(error => res.status(400).send(error))
    }
};