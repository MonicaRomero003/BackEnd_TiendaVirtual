const Sequelize = require('sequelize');
const usuario = require('../models/tbc_usuario');

module.exports = {
    create(req, res){
        return usuario
            .create({
                nombre: req.body.nombre,
                direccion: req.body.direccion,
                telefono: req.body.telefono,
                email: req.body.email,
                password: req.body.password,
                rol: req.body.rol,
                fecha_registro: req.body.fecha_registro || new Date(),
            })
            .then(usuario => res.status(200).send(usuario))
            .catch(error => res.status(400).send(error));
    },
    list(_, res){
        return usuario.findAll({})
            .then(usuarios => res.status(200).send(usuarios))
            .catch(error => res.status(400).send(error));
    },
    find(req, res){
        return usuario.findAll({
            where: {
                id: req.params.id,
            }
        })
            .then(usuario => res.status(200).send(usuario))
            .catch(error => res.status(400).send(error));
    },
    update(req, res){
        return usuario.findByPk(req.params.id)
            .then(usuarioEncontrado => {
                if (!usuarioEncontrado) {
                    return res.status(404).send({
                        message: 'Usuario no encontrado'
                    });
                }

                return usuarioEncontrado
                    .update({
                        nombre: req.body.nombre || usuarioEncontrado.nombre,
                        direccion: req.body.direccion || usuarioEncontrado.direccion,
                        telefono: req.body.telefono || usuarioEncontrado.telefono,
                        email: req.body.email || usuarioEncontrado.email,
                        password: req.body.password || usuarioEncontrado.password,
                        rol: req.body.rol || usuarioEncontrado.rol,
                        fecha_registro: req.body.fecha_registro || usuarioEncontrado.fecha_registro,
                    })
                    .then(usuarioActualizado => res.status(200).send(usuarioActualizado))
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },
    delete(req, res){
        return usuario.findByPk(req.params.id)
            .then(usuarioEncontrado => {
                if (!usuarioEncontrado) {
                    return res.status(404).send({
                        message: 'Usuario no encontrado'
                    });
                }

                return usuarioEncontrado
                    .destroy()
                    .then(() => res.status(200).send({
                        message: 'Usuario eliminado correctamente'
                    }))
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    }
};
