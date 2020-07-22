const {Router, request} = require('express')
const router = Router()
const Consumption = require('../models/out')
const Medicine = require('../models/medicine')
const Employee = require('../models/employee')
const Patient = require('../models/patient')

router.get('/', async (req, res) => {
    try {
        const allMedicines = await Medicine.findAll({
            where: {
                isActive: true
            },
            order: ['title']
        })
        const allEmployees = await Employee.findAll({
            order: ['name']
        })
        const allPatients = await Patient.findAll({
            order: ['name']
        })
        console.log(allMedicines)
        res.render('addConsumption', {
            title: 'Розхід',
            isConsumption: true,
            allMedicines,
            allEmployees,
            allPatients
        })
    } catch(e) {
        throw e    
    }
})

router.post('/', async (req, res) => {
    try {
        const allMedicines = await Medicine.findAll()
        const allEmployees = await Employee.findAll()
        const allPatients = await Patient.findAll()
        console.log(req.body)
        const {id, quantity, employeeName, patientName} = req.body
        const medicine = await Medicine.findOne({
            where: {
                id: id
            }
        })
        if (medicine.remainder < +quantity) {
            res.render('addConsumption', {
                allMedicines,
                allEmployees,
                allPatients
            })
        } else {
            medicine.remainder -=  +quantity 

            console.log('Medicine quantity = ', medicine.remainder)
            await medicine.save()
            console.log(medicine)
            console.log(employeeName, patientName)
    
            const consumption = await Consumption.create({
                MedicineId: +id,
                quantity: +quantity,
                employee: employeeName,
                patient: patientName,
                UserId: req.session.user.id
            })
    
            res.redirect(`/medicine?page=1&limit=10&isActive=1&order=title&upOrDown=ASC`)
        }
       

    } catch(e) {
        res.render('500')
    }
})


module.exports = router