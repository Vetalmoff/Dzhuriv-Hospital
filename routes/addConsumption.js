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
        const allMedicines = await Medicine.findAll()
        const allEmployees = await Employee.findAll()
        const allPacients = await Pacient.findAll()
        console.log(req.body)
        const {id, quantity, employeeName, pacientName, date} = req.body
        const medicine = await Medicine.findOne({
            where: {
                id: id
            }
        })
        if (medicine.count < +quantity) {
            res.render('addConsumption', {
                allMedicines,
                allEmployees,
                allPacients
            })
        } else {
            medicine.count -=  +quantity 

            console.log('Medicine quantity = ', medicine.count)
            await medicine.save()
            console.log(medicine)
            console.log(employeeName, pacientName)
    
            const consumption = await Consumption.create({
                MedicineId: +id,
                quantity: +quantity,
                employee: employeeName,
                pacient: pacientName,
                date
            })
    
            res.redirect('/medicine')
        }
       

    } catch(e) {
        res.render('500')
    }
})


module.exports = router