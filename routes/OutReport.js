const {Router} = require('express')
const router = Router()
const { Op, where, Sequelize } = require("sequelize")
const sequelize = require('../utils/db')
const Medicine = require('../models/medicine')
const Consumption = require('../models/out')
const Employee = require('../models/employee')
const Patient = require('../models/patient')
const User = require('../models/user')
const sgMail = require('@sendgrid/mail')
const keys = require('../keys/keys')
const reportEmail = require('../emails/report')
const dateToView = require('../middleware/dateToView')
const authModerator = require('../middleware/authModerator')


router.get('/', authModerator, async (req, res) => {
    try {
        const medicines = await Medicine.findAll({
            order: ['title']
        })
        const employees = await Employee.findAll({
            order: ['name']
        })
        const patients = await Patient.findAll({
            order: ['name']
        })

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

router.post('/', authModerator, async (req, res) => {
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
            //order: [['quantity', 'DESC']],
            include: [{
                model: Medicine,
                required: true,
                attributes: ['title', 'isActive']
            },
            {
                model: User,
                required: true,
                attributes: ['email', 'name']
            }]
            
        })

        console.log('consumptions ==== ', consumptions)


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
            order: [['quantity', 'DESC']],
            include: [{
                model: Medicine,
                required: true,
                attributes: ['title', 'isActive']
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
            },
            {
                model: User,
                required: true,
                attributes: ['email', 'name']
            }
            ]
        })

        //  Select all records in Consumptions TABLE and Group it by MedicineId
        const singleConsumptions = await Promise.all(consumptions.map(async item =>  await Consumption.findAll({
            where:   {              
                createdAt: {[Op.and]: [{[Op.gte]: new Date(req.body.from)}, {[Op.lte]: new Date(req.body.to)}]},
                MedicineId: item.MedicineId
            },
            order: [['quantity', 'DESC']],
            include: [{
                model: Medicine,
                required: true,
                attributes: ['title', 'isActive']
            },
            {
                model: User,
                required: true,
                attributes: ['email', 'name']
            }]
        })) ) 

        //  Find all MedicineId
        const allMedicineId = extendedConsumptions.map(item => item.MedicineId)

        //  Keep only uniq MedicineId
        const uniqueMedicineId = [...new Set(allMedicineId)] 
        

        const arrayOfArraysConsumptions = []
        
        //  Make an array of arrays with Consumptions group by MedicineId
        uniqueMedicineId.forEach((item, index) => arrayOfArraysConsumptions.push(extendedConsumptions.filter(element => element.MedicineId === uniqueMedicineId[index])))


        //  Count all remainders group by MedicineId
        const allRemainders = arrayOfArraysConsumptions.map(item => item.reduce((sum, current) => sum + current.quantity, 0))


        //  Alter array of arrays to => array of objects with new keys : name, sum
        const newArrOfConsumptions = arrayOfArraysConsumptions.map((item, index) => ({
            item,
            name: item[0].Medicine.title,
            sum: allRemainders[index],
            isActive: item[0].Medicine.isActive
        }))
        newArrOfConsumptions.sort((a, b) => b.sum - a.sum)
        console.log(newArrOfConsumptions)


        //  Change a format Date to view '01.01.01'
        newArrOfConsumptions.forEach(elem => elem.item.forEach(item => item.newDate = dateToView(item.createdAt)))

        req.session.consumptions = newArrOfConsumptions
        req.session.from = req.body.from
        req.session.to = req.body.to
       


        res.render('outReport', {
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

router.get('/sendConsumptions', async (req, res) => {
    try {

        const users = await User.findAll({
            where: {
                role: {
                    [Op.or]: ['moderator', 'admin']
                  }
            }
        })
        console.log(users)

        res.render('sendReport', {
            users
        })

    } catch (e) {
        throw e
    }
})

router.post('/sendReport', async (req, res) => {
        const {email} = req.body
        console.log(email)
        const consumptions = req.session.consumptions
        console.log(consumptions)

        let html = `
        <h1>Звіт по розходу за період : ${req.session.from} по : ${req.session.to}</h1>
        <p></p>
        <table class="table">
    <thead class="thead-dark">
        <tr>
        <th scope="col">#</th>
        <th scope="col">Назва</th>
        <th scope="col">Кількість</th>
        </tr>
    </thead>
    <tbody>`

        html += consumptions.reduce((sum ,item, index) => sum + `
            <tr>
            <th scope="row">${++index}</th>
            <td>${item.name}</td>
            <td>${item.sum}</td>
            </tr>
        `, `
        `)

        html += `</tbody>
    </table>`

        console.log(html)
        await sgMail.send(reportEmail(email, html))

        req.flash('success', `Звіт надіслано на пошту : ${email}`)
        res.redirect('/medicine?page=1&limit=3&isActive=1&order=title&upOrDown=ASC')
})


module.exports = router