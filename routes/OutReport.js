const {Router} = require('express')
const router = Router()
const { Op, where, Sequelize } = require("sequelize")
const sequelize = require('../utils/db')
const Medicine = require('../models/medicine')
const Consumption = require('../models/out')
const Employee = require('../models/employee')
const Patient = require('../models/patient')
const { sum } = require('../models/out')
const dateToView = require('../middleware/dateToView')

router.get('/', async (req, res) => {
    try {
        const medicines = await Medicine.findAll({})
        const employees = await Employee.findAll({})
        const patients = await Patient.findAll({})

        res.render('outReportForm', {
            title: 'Звіт по розходу',
            isReport: true,
            medicines,
            employees,
            patients
        })
    } catch(e) {
        throw e
    }
})

router.post('/', async (req, res) => {
    try {   

        const arrBodyMedicine = req.body.medicine.split('  ')
        const arrBodyEmployee = req.body.employee.split('  ')
        const arrBodyPatient = req.body.patient.split('  ')
        let employee, 
            patient,
            medicine

        
        if (arrBodyMedicine.length === 1) {
            medicine = await Medicine.findOne({
                where: {
                    id: {
                        [Op.in]: arrBodyMedicine
                    }
                }
            })
        }

        if (arrBodyEmployee.length === 1) {
            employee = await Employee.findOne({
                where: {
                    id: {
                        [Op.in]: arrBodyEmployee
                    }
                }
            })
        }
        

        if (arrBodyPatient.length === 1) {
            patient = await Patient.findOne({
                where: {
                    id: {
                        [Op.in]: arrBodyPatient
                    }
                }
            })
        } 



        //  Select dictinct records and sum theirs quantity and group by MedicineId
        const consumptions = await Consumption.findAll({
            attributes: ['MedicineId', [sequelize.fn('sum', sequelize.col('quantity')), 'quantity']],
            group: 'MedicineId',
            where: {
                createdAt: {[Op.and]: [{[Op.gte]: new Date(req.body.from)}, {[Op.lte]: new Date(req.body.to)}]},
                MedicineId: {
                    [Op.in]: arrBodyMedicine
                },
                employee: {
                    [Op.in]: arrBodyEmployee
                },
                patient: {
                    [Op.in]: arrBodyPatient
                }
            },
            include: [{
                model: Medicine,
                required: true,
                attributes: ['title']
            }]
        })


        //  Select ALL records of Consumptions TABLE
        const extendedConsumptions = await Consumption.findAll({
            where: {
                createdAt: {[Op.and]: [{[Op.gte]: new Date(req.body.from)}, {[Op.lte]: new Date(req.body.to)}]},
                MedicineId: {
                    [Op.in]: arrBodyMedicine
                },
                employee: {
                    [Op.in]: arrBodyEmployee
                },
                patient: {
                    [Op.in]: arrBodyPatient
                }
            },
            include: [{
                model: Medicine,
                required: true,
                attributes: ['title']
            },
            {
                model: Employee,
                required:true,
                attributes: ['name']
            },
            {
              model: Patient,
              required: true,
              attributes: ['name']  
            }
            ]
        })

        //  Select all records in Consumptions TABLE and Group it by MedicineId
        const singleConsumptions = await Promise.all(consumptions.map(async item =>  await Consumption.findAll({
            where:   {              
                createdAt: {[Op.and]: [{[Op.gte]: new Date(req.body.from)}, {[Op.lte]: new Date(req.body.to)}]},
                MedicineId: item.MedicineId
            },
            include: [{
                model: Medicine,
                required: true,
                attributes: ['title']
            }]
        })) ) 
        console.log('PromisAll = ', singleConsumptions)

        //  Find all MedicineId
        const allMedicineId = extendedConsumptions.map(item => item.MedicineId)
        console.log(allMedicineId)

        //  Lost only uniq MedicineId
        const uniqueMedicineId = [...new Set(allMedicineId)] 
        console.log(uniqueMedicineId)

        const arrayOfArraysConsumptions = []
        
        //  Make an array of arrays with Consumptions group by MedicineId
        uniqueMedicineId.forEach((item, index) => arrayOfArraysConsumptions.push(extendedConsumptions.filter(element => element.MedicineId === uniqueMedicineId[index])))


        //  Count all remainders group by MedicineId
        const allRemainders = arrayOfArraysConsumptions.map(item => item.reduce((sum, current) => sum + current.quantity, 0))
        console.log(allRemainders)


        //  Alter array of arrays to => array of objects with new keys : name, sum
        const newArrOfConsumptions = arrayOfArraysConsumptions.map((item, index) => ({
            item,
            name: item[0].Medicine.title,
            sum: allRemainders[index]
        }))
        console.log(newArrOfConsumptions)


        //  Change a format Date to view '01.01.01'
        newArrOfConsumptions.forEach(elem => elem.item.forEach(item => item.newDate = dateToView(item.createdAt)))


       


        res.render('outReport', {
            consumptions,
            newArrOfConsumptions,
            allRemainders,
            from: req.body.from,
            to: req.body.to,
            isReport: true,
            title: 'Звіт по розходу',
            employee,
            patient,
            medicine
        })

    } catch(e) {
        throw e
    }
})


module.exports = router