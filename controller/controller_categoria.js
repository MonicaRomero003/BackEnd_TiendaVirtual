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
    },
    update(req, res){
        return categoria.findByPk(req.params.id)
            .then(categoriaEncontrada => {
                if (!categoriaEncontrada) {
                    return res.status(404).send({
                        message: 'Categoria no encontrada'
                    });
                }

                return categoriaEncontrada
                    .update({
                        nombre: req.body.nombre || categoriaEncontrada.nombre,
                    })
                    .then(categoriaActualizada => res.status(200).send(categoriaActualizada))
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },
    delete(req, res){
        return categoria.findByPk(req.params.id)
            .then(categoriaEncontrada => {
                if (!categoriaEncontrada) {
                    return res.status(404).send({
                        message: 'Categoria no encontrada'
                    });
                }

                return categoriaEncontrada
                    .destroy()
                    .then(() => res.status(200).send({
                        message: 'Categoria eliminada correctamente'
                    }))
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    }
};