const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config();

const http = require('http');
const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => res.status(200).send({
    message: 'Bienvenido a mi api no segura de tienda virtual',
}));

require('./routes/route_categorias')(app);
require('./routes/route_usuarios')(app);
require('./routes/route_productos')(app);
require('./routes/route_carritos')(app);
require('./routes/route_carrito_detalle')(app);

const port = parseInt(process.env.PORT, 10) || 8000;
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
module.exports = app;