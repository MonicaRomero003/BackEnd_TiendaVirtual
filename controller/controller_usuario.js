const db = require('../models');
const usuario = db.tbc_usuarios;
const { Op } = db.Sequelize;
const jwt = require('jsonwebtoken');

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
    list(req, res){
        const {
            nombre,
            q,
            email,
            telefono,
            rol,
            fechaDesde,
            fechaHasta,
        } = req.query;

        const where = {};

        if (nombre || q) {
            const termino = (nombre || q).trim();
            if (termino) {
                where.nombre = {
                    [Op.like]: `%${termino}%`
                };
            }
        }

        if (email) {
            where.email = {
                [Op.like]: `%${email.trim()}%`
            };
        }

        if (telefono) {
            where.telefono = {
                [Op.like]: `%${telefono.trim()}%`
            };
        }

        if (rol) {
            where.rol = rol;
        }

        if (fechaDesde || fechaHasta) {
            where.fecha_registro = {};
            if (fechaDesde) {
                where.fecha_registro[Op.gte] = new Date(fechaDesde);
            }
            if (fechaHasta) {
                where.fecha_registro[Op.lte] = new Date(fechaHasta);
            }
        }

        return usuario.findAll({ where })
            .then(usuarios => res.status(200).send(usuarios))
            .catch(error => res.status(400).send(error));
    },
    find(req, res){
        return usuario.findByPk(req.params.id)
            .then(usuarioEncontrado => {
                if (!usuarioEncontrado) {
                    return res.status(404).send({
                        message: 'Usuario no encontrado'
                    });
                }

                return res.status(200).send(usuarioEncontrado);
            })
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
                            nombre: req.body.nombre ?? usuarioEncontrado.nombre,
                            direccion: req.body.direccion ?? usuarioEncontrado.direccion,
                            telefono: req.body.telefono ?? usuarioEncontrado.telefono,
                            email: req.body.email ?? usuarioEncontrado.email,
                            password: req.body.password ?? usuarioEncontrado.password,
                            rol: req.body.rol ?? usuarioEncontrado.rol,
                            fecha_registro: req.body.fecha_registro ?? usuarioEncontrado.fecha_registro,
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
    },
    login(req, res){
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({
                message: 'El correo y la contrasena son obligatorios'
            });
        }

        return usuario.findOne({
            where: {
                email: email.trim()
            }
        })
            .then(usuarioEncontrado => {
                if (!usuarioEncontrado || usuarioEncontrado.password !== password) {
                    return res.status(401).send({
                        message: 'Credenciales invalidas'
                    });
                }

                const jwtSecret = process.env.JWT_SECRET || 'dev_secret_change_me';
                const token = jwt.sign(
                    {
                        id: usuarioEncontrado.id,
                        email: usuarioEncontrado.email,
                        rol: usuarioEncontrado.rol,
                    },
                    jwtSecret,
                    { expiresIn: '8h' }
                );

                return res.status(200).send({
                    token
                });
            })
            .catch(error => res.status(400).send(error));
    }
};
