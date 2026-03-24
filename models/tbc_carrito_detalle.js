'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbc_carrito_detalle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      tbc_carrito_detalle.belongsTo(models.tbc_carritos, {
        as: 'tbc_carritos',
        foreignKey: 'id_carrito'
      });

      tbc_carrito_detalle.belongsTo(models.tbc_productos, {
        as: 'tbc_productos',
        foreignKey: 'id_producto'
      });
    }
  }
  tbc_carrito_detalle.init({
    id_carrito:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'tbc_carrito_detalle',
  });
  return tbc_carrito_detalle;
};