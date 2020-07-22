const {Router} = require('express')
const router = Router()
const Patient = require('../models/patient')
const Consumption = require('../models/out')
const authModerator = require('../middleware/authModerator')
const authAdmin = require('../middleware/authAdmin')
const dateToForm = require('../middleware/dateToForm')

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
            isCatalog: true
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

router.post('/edit', authAdmin, async (req, res) => {
    try {
        const {id, name, dateOfBirdth, desc} = req.body
        const anyConsumptions = await Consumption.findOne({
            where: {
                patient: id
            }
        })

        if (!anyConsumptions) {
            const item = await Patient.update({name, dateOfBirdth, description: desc}, {
                where: {
                    id
                }
            })
        }    
        res.redirect('/patients')
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

        if (!anyConsumptions) {
            const item = await Patient.destroy({
                where: {
                    id
                }
            })
        }
        res.redirect('/patients')
    } catch(e) {
        throw e
    }
})


module.exports = router