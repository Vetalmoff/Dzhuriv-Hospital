const {Router} = require('express')
const router = Router()
const Consumption = require('../models/out')
const Medicine = require('../models/medicine')
const Employee = require('../models/employee')
const Pacient = require('../models/pacient')

router.get('/', async (req, res) => {
    try {
        const allMedicines = await Medicine.findAll()
        const allEmployees = await Employee.findAll()
        const allPacients = await Pacient.findAll()
        res.render('addConsumption', {
            title: 'Розхід',
            isConsumption: true,
            allMedicines,
            allEmployees,
            allPacients
        })
    } catch(e) {
        res.render('500')
    }
})

router.post('/', async (req, res) => {
    try {
        console.log(req.body)
        const {id, quantity, employeeName, pacientName} = req.body
        const medicine = await Medicine.findOne({
            where: {
                id: id
            }
        })
        medicine.count -=  +quantity 
        if (medicine.quantity < 0) {
            res.redirect('/addConsumption')
        }
        console.log('Medicine quantity = ', medicine.count)
        await medicine.save()
        console.log(medicine)
        console.log(employeeName, pacientName)

        const consumption = await Consumption.create({
            MedicineId: +id,
            quantity: +quantity,
            employee: employeeName,
            pacient: pacientName
        })

        res.redirect('/medicine')

    } catch(e) {
        res.render('500')
    }
})


module.exports = router