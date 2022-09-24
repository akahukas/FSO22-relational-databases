const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class ServerSession extends Model {}

ServerSession.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  token: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  validity: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'serversession'
})

module.exports = ServerSession
