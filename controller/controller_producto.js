const Sequelize = require('sequelize');
const productoc = require('../models/tbc_producto');

module.exports = {
    create(req, res){
        return producto
            .create({
                nombre: req.body.nombre,
                descripcion: req.body.descripcion,
                precio: req.body.precio,
                stock: req.body.stock,
                id_categoria: req.body.id_categoria,
            })
            .then(producto => res.status(200).send(producto))
            .catch(error => res.status(400).send(error));
    },
    list(_, res){
        return producto.findAll({})
            .then(productos => res.status(200).send(productos))
            .catch(error => res.status(400).send(error));
    },
    find(req, res){
        return producto.findAll({
            where: {
                id: req.params.id,
            }
        })
            .then(producto => res.status(200).send(producto))
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
                        nombre: req.body.nombre || productoEncontrado.nombre,
                        descripcion: req.body.descripcion || productoEncontrado.descripcion,
                        precio: req.body.precio || productoEncontrado.precio,
                        stock: req.body.stock || productoEncontrado.stock,
                        id_categoria: req.body.id_categoria || productoEncontrado.id_categoria,
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
