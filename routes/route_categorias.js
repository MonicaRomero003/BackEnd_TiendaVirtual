const categoriacontroller = require('../controller/controller_categoria');

module.exports = (app) => {
    app.get('/api/categorias', categoriacontroller.list);
    app.get('/api/categorias/:nombre', categoriacontroller.find);
    app.post('/api/categorias', categoriacontroller.create);
    app.delete('/api/categorias/:id', categoriacontroller.delete);
    app.put('/api/categorias/:id', categoriacontroller.update);
}