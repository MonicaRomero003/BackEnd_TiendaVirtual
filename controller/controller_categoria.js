const Sequelize = require('sequelize');
const categoria = require('../models/tbc_categorias');



module.exports = {
    create(req, res){
        return categoria
        .create({
            nombre: req.params.nombre
        })
        .then(categoria=>res.status(200).send(categoria))
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
    }
};