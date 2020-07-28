const {Router} = require('express')
const router = Router()
const Employee = require('../models/employee')
const Consumption = require('../models/out')
const authModerator = require('../middleware/authModerator')
const authAdmin = require('../middleware/authAdmin')
const { employeeValidators } = require('../middleware/validators')
const { validationResult } = require('express-validator')


router.get('/', authModerator, async (req, res) => {
    try {
        const employees = await Employee.findAll()
        res.render('employees', {
            employees,
            title: 'Співробітники',
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
        const item = await Employee.findByPk(req.params.id) 
        console.log('Item = ', item)
        res.render('editEmploye', {
            title: 'Редагувати',
            item
        })
    } catch(e) {
        throw e
    }
})

router.post('/edit', authAdmin, employeeValidators, async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('errorEmployee', errors.array()[0].msg)
            return res.status(422).redirect('/addEmployee')
        }
        const {id, name, position, desc} = req.body
        const anyConsumptions = await Consumption.findOne({
            where: {
                employee: id
            }
        })

        if (!anyConsumptions) {
            const employee = await Employee.findByPk(id)
            const item = await Employee.update({name, position, description: desc}, {
                where: {
                    id
                }
            })
            req.flash('success', `Співробітника ${employee.name} змінено`)
            res.redirect('/employees')
        } else {
            req.flash('error', 'Неможливо редагувати дані, якщо по ним вже є прихід, чи розхід')
            res.redirect('/employees')

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
                employee: id
            }
        })

        const employee = await Employee.findByPk(id)

        if (!anyConsumptions) {
            const item = await Employee.destroy({
                where: {
                    id
                }
            })
            req.flash('success', `Співробітника ${employee.name} успішно видалено`)
            res.redirect('/employees')
        } else {
            req.flash('error', 'Неможливо редагувати дані, якщо по ним вже є прихід, чи розхід')
            res.redirect('/employees')
        }
        
        
    } catch(e) {
        throw e
    }
})




module.exports = router