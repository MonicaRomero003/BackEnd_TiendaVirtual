'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbc_productos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tbc_productos.init({
    nombre:{ 
    type: DataTypes.STRING(100),
    allowNull: false 
  },
    descripcion: { 
    type: DataTypes.STRING(255),
    allowNull: false 
    },
    precio: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false 
    },
    stock: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
    },
    id_categoria: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
    }
  }, {
    sequelize,
    modelName: 'tbc_productos',
  });
  return tbc_productos;
};