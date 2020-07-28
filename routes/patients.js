const {Router} = require('express')
const router = Router()
const Patient = require('../models/patient')
const Consumption = require('../models/out')
const authModerator = require('../middleware/authModerator')
const authAdmin = require('../middleware/authAdmin')
const dateToForm = require('../middleware/dateToForm')
const { patientValidators } = require('../middleware/validators')
const { validationResult } = require('express-validator')
const patient = require('../models/patient')

router.get('/', authModerator, async (req, res) => {
    try {
        const patients = await Patient.findAll()
        patients.forEach(item => {
            const date1 = new Date(Date.now()) 
            const date2 = new Date(item.dateOfBirdth)
            console.log('date1 = ', date1, 'data2 = ', date2)
            const diffTime = Math.abs(date2 - date1)
            const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365))
            item.age = diffYears
        })
        console.log(patients)
        res.render('patients', {
            patients,
            title: 'Пацієнти',
            isCatalog: true,
            error: req.flash('error'),
            success: req.flash('success')
        })
    } catch(e) {
        throw e
    }
    
})

router.get('/:id/edit', authAdmin, async (req, res) => {
    try {
        const item = await Patient.findByPk(req.params.id) 
        console.log('Item = ', item)
        item.onlyDate = dateToForm(item.dateOfBirdth) 
        console.log(item.onlyDate)
        res.render('editPatient', {
            title: 'Редагувати',
            item
        })
    } catch(e) {
        throw e
    }
})

router.post('/edit', authAdmin, patientValidators, async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('errorPatient', errors.array()[0].msg)
            return res.status(422).redirect('/addPatient')
        }
        const {id, name, dateOfBirdth, desc} = req.body
        const anyConsumptions = await Consumption.findOne({
            where: {
                patient: id
            }
        })

        const patient = await Patient.findByPk(id)

        if (!anyConsumptions) {
            const item = await Patient.update({name, dateOfBirdth, description: desc}, {
                where: {
                    id
                }
            })
            req.flash('success', `Пацієнта ${patient.name} змінено`)
            res.redirect('/patients')
        } else {
            req.flash('error', 'Неможливо редагувати дані, якщо по ним вже є прихід, чи розхід')
            res.redirect('/patients')
        }

    } catch(e) {
        throw e
    }
})

router.post('/delete', authAdmin, async (req, res) => {
    try {
        const {id} = req.body
        const anyConsumptions = await Consumption.findOne({
            where: {
                patient: id
            }
        })
        
        const patient = await Patient.findByPk(id)

        if (!anyConsumptions) {
            const item = await Patient.destroy({
                where: {
                    id
                }
            })
            req.flash('success', `Пацієнта ${patient.name} успішно видалено`)
            res.redirect('/patients')
        } else {
            req.flash('error', 'Неможливо редагувати дані, якщо по ним вже є прихід, чи розхід')
            res.redirect('/patients')
        }
        
    } catch(e) {
        throw e
    }
})


module.exports = router