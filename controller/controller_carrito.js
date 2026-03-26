const Sequelize = require('sequelize');
const carrito = require('../models/tbc_carrito');

module.exports = {
    create(req, res){
        return carrito
            .create({
                fecha_creacion: req.body.fecha_creacion || new Date(),
                total: req.body.total,
                id_usuario: req.body.id_usuario,
            })
            .then(carrito => res.status(200).send(carrito))
            .catch(error => res.status(400).send(error));
    },
    list(_, res){
        return carrito.findAll({})
            .then(carritos => res.status(200).send(carritos))
            .catch(error => res.status(400).send(error));
    },
    find(req, res){
        return carrito.findAll({
            where: {
                id: req.params.id,
            }
        })
            .then(carrito => res.status(200).send(carrito))
            .catch(error => res.status(400).send(error));
    },
    update(req, res){
        return carrito.findByPk(req.params.id)
            .then(carritoEncontrado => {
                if (!carritoEncontrado) {
                    return res.status(404).send({
                        message: 'Carrito no encontrado'
                    });
                }

                return carritoEncontrado
                    .update({
                        fecha_creacion: req.body.fecha_creacion || carritoEncontrado.fecha_creacion,
                        total: req.body.total || carritoEncontrado.total,
                        id_usuario: req.body.id_usuario || carritoEncontrado.id_usuario,
                    })
                    .then(carritoActualizado => res.status(200).send(carritoActualizado))
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },
    delete(req, res){
        return carrito.findByPk(req.params.id)
            .then(carritoEncontrado => {
                if (!carritoEncontrado) {
                    return res.status(404).send({
                        message: 'Carrito no encontrado'
                    });
                }

                return carritoEncontrado
                    .destroy()
                    .then(() => res.status(200).send({
                        message: 'Carrito eliminado correctamente'
                    }))
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    }
};
