const db = require('../models');
const carritoDetalle = db.tbc_carrito_detalle;
const carrito = db.tbc_carritos;
const { Op } = db.Sequelize;

function recalcularTotalCarrito(idCarrito) {
    if (!idCarrito) {
        return Promise.resolve();
    }

    return carritoDetalle.findAll({
        where: {
            id_carrito: idCarrito,
        }
    })
        .then(detalles => {
            const total = detalles.reduce((acumulado, detalle) => {
                const precio = Number(detalle.precio_unitario) || 0;
                const cantidad = Number(detalle.cantidad) || 0;
                return acumulado + (precio * cantidad);
            }, 0);

            return carrito.update({
                total: Number(total.toFixed(2))
            }, {
                where: {
                    id: idCarrito,
                }
            });
        });
}

module.exports = {
    create(req, res){
        return carritoDetalle
            .create({
                id_carrito: req.body.id_carrito,
                id_producto: req.body.id_producto,
                precio_unitario: req.body.precio_unitario,
                cantidad: req.body.cantidad,
            })
            .then(carritoDetalleCreado => {
                return recalcularTotalCarrito(carritoDetalleCreado.id_carrito)
                    .then(() => res.status(200).send(carritoDetalleCreado));
            })
            .catch(error => res.status(400).send(error));
    },
    list(req, res){
        const {
            id_carrito,
            id_producto,
            precioMin,
            precioMax,
            cantidadMin,
            cantidadMax,
        } = req.query;

        const where = {};

        if (id_carrito !== undefined) {
            where.id_carrito = id_carrito;
        }

        if (id_producto !== undefined) {
            where.id_producto = id_producto;
        }

        if (precioMin !== undefined || precioMax !== undefined) {
            where.precio_unitario = {};
            if (precioMin !== undefined) {
                where.precio_unitario[Op.gte] = Number(precioMin);
            }
            if (precioMax !== undefined) {
                where.precio_unitario[Op.lte] = Number(precioMax);
            }
        }

        if (cantidadMin !== undefined || cantidadMax !== undefined) {
            where.cantidad = {};
            if (cantidadMin !== undefined) {
                where.cantidad[Op.gte] = Number(cantidadMin);
            }
            if (cantidadMax !== undefined) {
                where.cantidad[Op.lte] = Number(cantidadMax);
            }
        }

        return carritoDetalle.findAll({ where })
            .then(carritoDetalle => res.status(200).send(carritoDetalle))
            .catch(error => res.status(400).send(error));
    },
    find(req, res){
        return carritoDetalle.findByPk(req.params.id)
            .then(carritoDetalleEncontrado => {
                if (!carritoDetalleEncontrado) {
                    return res.status(404).send({
                        message: 'Detalle de carrito no encontrado'
                    });
                }

                return res.status(200).send(carritoDetalleEncontrado);
            })
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

                const idCarritoAnterior = carritoDetalleEncontrado.id_carrito;

                return carritoDetalleEncontrado
                    .update({
                        id_carrito: req.body.id_carrito ?? carritoDetalleEncontrado.id_carrito,
                        id_producto: req.body.id_producto ?? carritoDetalleEncontrado.id_producto,
                        precio_unitario: req.body.precio_unitario ?? carritoDetalleEncontrado.precio_unitario,
                        cantidad: req.body.cantidad ?? carritoDetalleEncontrado.cantidad,
                    })
                    .then(carritoDetalleActualizado => {
                        const recalculos = [recalcularTotalCarrito(idCarritoAnterior)];

                        if (carritoDetalleActualizado.id_carrito !== idCarritoAnterior) {
                            recalculos.push(recalcularTotalCarrito(carritoDetalleActualizado.id_carrito));
                        }

                        return Promise.all(recalculos)
                            .then(() => res.status(200).send(carritoDetalleActualizado));
                    })
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

                const idCarrito = carritoDetalleEncontrado.id_carrito;

                return carritoDetalleEncontrado
                    .destroy()
                    .then(() => recalcularTotalCarrito(idCarrito))
                    .then(() => res.status(200).send({
                        message: 'Detalle de carrito eliminado correctamente'
                    }))
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    }
};
