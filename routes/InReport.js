const {Router} = require('express')
const { Op, where, Sequelize } = require("sequelize")
const router = Router()
const Consumption = require('../models/out')
const Medicine = require('../models/medicine')
const Incoming = require('../models/in')
const Employee = require('../models/employee')
const Patient = require('../models/patient')
const sequelize = require('../utils/db')


router.get('/', async (req, res) => {
    try {
        const allMedicines = await Medicine.findAll()
        console.log('allMedicines.length = ', allMedicines.length)
        res.render('InReportForm', {
            title: 'Звіт по приходу',
            isReport: true,
            allMedicines,
        })
    } catch(e) {
        res.render('500')
    }
})

router.post('/', async(req, res) => {
    try {   
        const arrBody = req.body.id.split('  ')
        
        console.log('arrBody = ', arrBody)
        console.log(req.body)
  
        const incomings = await Incoming.findAll({
            attributes: ['MedicineId', [sequelize.fn('sum', sequelize.col('quantity')), 'quantity']],
            group: 'MedicineId',
            where: {
                createdAt: {[Op.and]: [{[Op.gte]: new Date(req.body.from)}, {[Op.lte]: new Date(req.body.to)}]},
                MedicineId: {
                    [Op.in]: arrBody
                }
            },
            include: [{
                model: Medicine,
                required: true,
                attributes: ['title']
            }]
        })

        console.log(incomings)
        console.log('Form =', req.body.id)
        

        res.render('inReport', {
            incomings,
            from: req.body.from,
            to: req.body.to,
            isReport: true,
            title: 'Звіт по приходу'
        })

    } catch(e) {
        res.render('500')
    }
})


module.exports = router