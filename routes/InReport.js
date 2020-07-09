const {Router} = require('express')
const router = Router()
const Consumption = require('../models/out')
const Medicine = require('../models/medicine')
const Incoming = require('../models/in')
const Employee = require('../models/employee')
const Pacient = require('../models/pacient')


router.get('/', async (req, res) => {
    try {
        const allMedicines = await Medicine.findAll()
        const incoming = await Incoming.findAll()
        res.render('InReportForm', {
            title: 'Звіт по приходу',
            isReport: true,
            allMedicines,
            incoming
        })
    } catch(e) {
        res.render('500')
    }
})

router.post('/', async(req, res) => {
    try {   
        const incoming = await Incoming.findAll({
            include: [{
                model: Medicine,
                where: {
                    id: req.body.id
                }
            }]
        })
        
        

        console.log('Form = ', req.body)
        

        console.log(incoming)

        const medicine = await Medicine.findAll({ 
    
            where: {
                id: req.body.id
            },
            include: [{
                model: Incoming
            }]
        })
        // const sum = await Incoming.sum('quantity', {
        //     where: {
        //         MedicineId: req.body.id
        //     }
        // })
        console.log(medicine)
        // console.log(sum)


        res.render('inReport', {
            incoming
        })
    } catch(e) {
        res.render('500')
    }
})


module.exports = router