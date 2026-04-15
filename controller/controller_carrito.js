const db = require('../models');
const carrito = db.tbc_carritos;
const { Op } = db.Sequelize;

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
    list(req, res){
        const {
            id_usuario,
            totalMin,
            totalMax,
            fechaDesde,
            fechaHasta,
        } = req.query;

        const where = {};

        if (id_usuario !== undefined) {
            where.id_usuario = id_usuario;
        }

        if (totalMin !== undefined || totalMax !== undefined) {
            where.total = {};
            if (totalMin !== undefined) {
                where.total[Op.gte] = Number(totalMin);
            }
            if (totalMax !== undefined) {
                where.total[Op.lte] = Number(totalMax);
            }
        }

        if (fechaDesde || fechaHasta) {
            where.fecha_creacion = {};
            if (fechaDesde) {
                where.fecha_creacion[Op.gte] = new Date(fechaDesde);
            }
            if (fechaHasta) {
                where.fecha_creacion[Op.lte] = new Date(fechaHasta);
            }
        }

        return carrito.findAll({ where })
            .then(carritos => res.status(200).send(carritos))
            .catch(error => res.status(400).send(error));
    },
    find(req, res){
        return carrito.findByPk(req.params.id)
            .then(carritoEncontrado => {
                if (!carritoEncontrado) {
                    return res.status(404).send({
                        message: 'Carrito no encontrado'
                    });
                }

                return res.status(200).send(carritoEncontrado);
            })
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
                        fecha_creacion: req.body.fecha_creacion ?? carritoEncontrado.fecha_creacion,
                        total: req.body.total ?? carritoEncontrado.total,
                        id_usuario: req.body.id_usuario ?? carritoEncontrado.id_usuario,
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
