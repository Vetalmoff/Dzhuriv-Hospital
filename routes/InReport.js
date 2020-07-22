const {Router} = require('express')
const { Op, where, Sequelize } = require("sequelize")
const router = Router()
const Consumption = require('../models/out')
const Medicine = require('../models/medicine')
const User = require('../models/user')
const Incoming = require('../models/in')
const Employee = require('../models/employee')
const Patient = require('../models/patient')
const sequelize = require('../utils/db')
const dateToView = require('../middleware/dateToView')
const authModerator = require('../middleware/authModerator')



router.get('/', authModerator, async (req, res) => {
    try {
        const allMedicines = await Medicine.findAll({
            order: ['title']
        })
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

router.post('/', authModerator, async(req, res) => {
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
            order: ['createdAt'],
            include: [{
                model: Medicine,
                required: true,
                attributes: ['title', 'isActive']
            },
            {
                model: User,
                required: true,
                attributes: ['email', 'name']
            }
            ]
        })

        // console.log(incomings)
        // console.log('Form =', req.body.id)


        //  Select all records in Incomings TABLE and Group it by MedicineId
        const singleIncomings = await Promise.all(incomings.map(async item =>  await Incoming.findAll({
            where:   {              
                createdAt: {[Op.and]: [{[Op.gte]: new Date(req.body.from)}, {[Op.lte]: new Date(req.body.to)}]},
                MedicineId: item.MedicineId
            },
            order: ['createdAt'],
            include: [{
                model: Medicine,
                required: true,
                attributes: ['title', 'isActive']
            },
            {
                model: User,
                required: true,
                attributes: ['email', 'name']
            }
            ]
        })) ) 
        console.log('PromisAll = ', singleIncomings)

        //  Count all remainders group by MedicineId
        const allRemainders = singleIncomings.map(item => item.reduce((sum, current) => sum + current.quantity, 0))
        console.log(allRemainders)

        //  Alter array of arrays to => array of objects with new keys : name, sum
        const newArrOfIncomings = singleIncomings.map((item, index) => ({
            item,
            name: item[0].Medicine.title,
            sum: allRemainders[index],
            isActive: item[0].Medicine.isActive
        }))
        console.log(newArrOfIncomings)

        //  Change a format Date to view '01.01.01'
        newArrOfIncomings.forEach(elem => elem.item.forEach(item => item.newDate = dateToView(item.createdAt)))
        

        res.render('inReport', {
            incomings,
            from: req.body.from,
            to: req.body.to,
            isReport: true,
            title: 'Звіт по приходу',
            newArrOfIncomings
        })

    } catch(e) {
        throw e
    }
})


module.exports = router