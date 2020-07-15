const {Router} = require('express')
const router = Router()
const { Op, where, Sequelize } = require("sequelize")
const sequelize = require('../utils/db')
const Medicine = require('../models/medicine')
const Consumption = require('../models/out')
const Employee = require('../models/employee')
const Pacient = require('../models/pacient')

router.get('/', async (req, res) => {
    try {
        const medicines = await Medicine.findAll({})
        const employees = await Employee.findAll({})
        const pacients = await Pacient.findAll({})

        res.render('outReportForm', {
            title: 'Звіт по розходу',
            isReport: true,
            medicines,
            employees,
            pacients
        })
    } catch(e) {
        throw e
    }
})

router.post('/', async (req, res) => {
    try {   
        const arrBodyId = req.body.id.split('  ')
        
        console.log('arrBody = ', arrBodyId)
        console.log(req.body)
  
        const consumptions = await Consumption.findAll({
            attributes: ['MedicineId', [sequelize.fn('sum', sequelize.col('quantity')), 'quantity'], 'date'],
            group: 'MedicineId',
            where: {
                date: {[Op.and]: [{[Op.gte]: new Date(req.body.from)}, {[Op.lte]: new Date(req.body.to)}]},
                MedicineId: {
                    [Op.in]: arrBodyId
                }
            },
            include: [{
                model: Medicine,
                required: true,
                attributes: ['title']
            }]
        })

        console.log(consumptions)
        console.log('Form =', req.body.id)
        

        res.render('outReport', {
            consumptions,
            from: req.body.from,
            to: req.body.to
        })

    } catch(e) {
        throw e
    }
})


module.exports = router