const db = require('../models');
const producto = db.tbc_productos;
const { Op } = db.Sequelize;

module.exports = {
    create(req, res){
        return producto
            .create({
                nombre: req.body.nombre,
                descripcion: req.body.descripcion,
                imagen: req.body.imagen,
                precio: req.body.precio,
                stock: req.body.stock,
                id_categoria: req.body.id_categoria,
            })
            .then(producto => res.status(200).send(producto))
            .catch(error => res.status(400).send(error));
    },
    list(req, res){
        const {
            nombre,
            q,
            id_categoria,
            precioMin,
            precioMax,
            stockMin,
            stockMax,
        } = req.query;

        const where = {};

        // Permite buscar por nombre con coincidencia parcial
        if (nombre || q) {
            const termino = (nombre || q).trim();
            if (termino) {
                where.nombre = {
                    [Op.like]: `%${termino}%`
                };
            }
        }

        if (id_categoria !== undefined) {
            where.id_categoria = id_categoria;
        }

        if (precioMin !== undefined || precioMax !== undefined) {
            where.precio = {};
            if (precioMin !== undefined) {
                where.precio[Op.gte] = Number(precioMin);
            }
            if (precioMax !== undefined) {
                where.precio[Op.lte] = Number(precioMax);
            }
        }

        if (stockMin !== undefined || stockMax !== undefined) {
            where.stock = {};
            if (stockMin !== undefined) {
                where.stock[Op.gte] = Number(stockMin);
            }
            if (stockMax !== undefined) {
                where.stock[Op.lte] = Number(stockMax);
            }
        }

        return producto.findAll({ where })
            .then(productos => res.status(200).send(productos))
            .catch(error => res.status(400).send(error));
    },
    find(req, res){
        return producto.findByPk(req.params.id)
            .then(productoEncontrado => {
                if (!productoEncontrado) {
                    return res.status(404).send({
                        message: 'Producto no encontrado'
                    });
                }

                return res.status(200).send(productoEncontrado);
            })
            .catch(error => res.status(400).send(error));
    },
    update(req, res){
        return producto.findByPk(req.params.id)
            .then(productoEncontrado => {
                if (!productoEncontrado) {
                    return res.status(404).send({
                        message: 'Producto no encontrado'
                    });
                }

                return productoEncontrado
                    .update({
                        nombre: req.body.nombre ?? productoEncontrado.nombre,
                        descripcion: req.body.descripcion ?? productoEncontrado.descripcion,
                        imagen: req.body.imagen ?? productoEncontrado.imagen,
                        precio: req.body.precio ?? productoEncontrado.precio,
                        stock: req.body.stock ?? productoEncontrado.stock,
                        id_categoria: req.body.id_categoria ?? productoEncontrado.id_categoria,
                    })
                    .then(productoActualizado => res.status(200).send(productoActualizado))
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },
    delete(req, res){
        return producto.findByPk(req.params.id)
            .then(productoEncontrado => {
                if (!productoEncontrado) {
                    return res.status(404).send({
                        message: 'Producto no encontrado'
                    });
                }

                return productoEncontrado
                    .destroy()
                    .then(() => res.status(200).send({
                        message: 'Producto eliminado correctamente'
                    }))
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    }
};
