const {Router} = require('express')
const router = Router()
const Consumption = require('../models/out')
const Medicine = require('../models/medicine')
const Employee = require('../models/employee')
const Patient = require('../models/patient')

router.get('/', async (req, res) => {
    try {
        const allMedicines = await Medicine.findAll()
        const allEmployees = await Employee.findAll()
        const allPatients = await Patient.findAll()
        res.render('addConsumption', {
            title: 'Розхід',
            isConsumption: true,
            allMedicines,
            allEmployees,
            allPatients
        })
    } catch(e) {
        res.render('500')
    }
})

router.post('/', async (req, res) => {
    try {
        const allMedicines = await Medicine.findAll()
        const allEmployees = await Employee.findAll()
        const allPatients = await Patient.findAll()
        console.log(req.body)
        const {id, quantity, employeeName, patientName, date} = req.body
        const medicine = await Medicine.findOne({
            where: {
                id: id
            }
        })
        if (medicine.count < +quantity) {
            res.render('addConsumption', {
                allMedicines,
                allEmployees,
                allPatients
            })
        } else {
            medicine.count -=  +quantity 

            console.log('Medicine quantity = ', medicine.count)
            await medicine.save()
            console.log(medicine)
            console.log(employeeName, patientName)
    
            const consumption = await Consumption.create({
                MedicineId: +id,
                quantity: +quantity,
                employee: employeeName,
                patient: patientName,
                date
            })
    
            res.redirect('/medicine')
        }
       

    } catch(e) {
        res.render('500')
    }
})


module.exports = router