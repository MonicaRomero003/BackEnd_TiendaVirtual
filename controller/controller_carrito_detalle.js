const Sequelize = require('sequelize');
const carritoDetalle = require('../models/tbc_carrito_detalle');

module.exports = {
    create(req, res){
        return carritoDetalle
            .create({
                id_carrito: req.body.id_carrito,
                id_producto: req.body.id_producto,
                precio_unitario: req.body.precio_unitario,
                cantidad: req.body.cantidad,
            })
            .then(carritoDetalle => res.status(200).send(carritoDetalle))
            .catch(error => res.status(400).send(error));
    },
    list(_, res){
        return carritoDetalle.findAll({})
            .then(carritoDetalle => res.status(200).send(carritoDetalle))
            .catch(error => res.status(400).send(error));
    },
    find(req, res){
        return carritoDetalle.findAll({
            where: {
                id: req.params.id,
            }
        })
            .then(carritoDetalle => res.status(200).send(carritoDetalle))
            .catch(error => res.status(400).send(error));
    },
    update(req, res){
        return carritoDetalle.findByPk(req.params.id)
            .then(carritoDetalleEncontrado => {
                if (!carritoDetalleEncontrado) {
                    return res.status(404).send({
                        message: 'Detalle de carrito no encontrado'
                    });
                }

                return carritoDetalleEncontrado
                    .update({
                        id_carrito: req.body.id_carrito || carritoDetalleEncontrado.id_carrito,
                        id_producto: req.body.id_producto || carritoDetalleEncontrado.id_producto,
                        precio_unitario: req.body.precio_unitario || carritoDetalleEncontrado.precio_unitario,
                        cantidad: req.body.cantidad || carritoDetalleEncontrado.cantidad,
                    })
                    .then(carritoDetalleActualizado => res.status(200).send(carritoDetalleActualizado))
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },
    delete(req, res){
        return carritoDetalle.findByPk(req.params.id)
            .then(carritoDetalleEncontrado => {
                if (!carritoDetalleEncontrado) {
                    return res.status(404).send({
                        message: 'Detalle de carrito no encontrado'
                    });
                }

                return carritoDetalleEncontrado
                    .destroy()
                    .then(() => res.status(200).send({
                        message: 'Detalle de carrito eliminado correctamente'
                    }))
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    }
};
