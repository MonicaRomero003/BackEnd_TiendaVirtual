const usuarioController = require('../controller/controller_usuario');

module.exports = (app) => {
    app.get('/api/usuarios', usuarioController.list);
    app.get('/api/usuarios/:id', usuarioController.find);
    app.post('/api/usuarios', usuarioController.create);
    app.put('/api/usuarios/:id', usuarioController.update);
    app.delete('/api/usuarios/:id', usuarioController.delete);
};
