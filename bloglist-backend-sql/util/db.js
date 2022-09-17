const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
})

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('You have successfully connected to the database.')
  }
  catch (error) {
    console.log('Connecting to the database failed.')
    return process.exit(1)
  }

  return null
}

module.exports = {
  connectToDatabase,
  sequelize
}
