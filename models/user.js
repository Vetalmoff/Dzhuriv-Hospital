const {Sequelize, DataTypes, INTEGER} = require('sequelize')
const sequelize = require('../utils/db')
const Incoming = require('./in')
const Consumption = require('./out')
const Medicine = require('./medicine')
const Employee = require('./employee')
const Patient = require('./patient')

const user = sequelize.define('User', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    isModerator: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }

})


user.hasMany(Medicine, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT'
})
Medicine.belongsTo(user)

user.hasMany(Employee, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT'
})
Employee.belongsTo(user)

user.hasMany(Patient, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT'
})
Patient.belongsTo(user)

user.hasMany(Incoming, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT'
})
Incoming.belongsTo(user)

user.hasMany(Consumption, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT'
})
Consumption.belongsTo(user)


module.exports = user