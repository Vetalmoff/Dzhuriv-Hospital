const {Sequelize} = require('sequelize')
const { DB, user, password, host } = require('../keys/keys')
const sequelize = new Sequelize(DB, user, password, {
    host,
    dialect: 'mysql'
})


module.exports = sequelize

