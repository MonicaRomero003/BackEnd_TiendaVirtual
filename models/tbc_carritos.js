'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbc_carritos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      tbc_carritos.belongsTo(models.tbc_usuarios, {
        as: 'tbc_usuarios',
        foreignKey: 'id_usuario'
      });

      tbc_carritos.hasMany(models.tbc_carrito_detalle, {
        as: 'tbc_carrito_detalle',
        foreignKey: 'id_carrito'
      });
    }
  }
  tbc_carritos.init({
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'tbc_carritos',
  });
  return tbc_carritos;
};