const {Router} = require('express')
const router = Router()
const Employee = require('../models/employee')
const Consumption = require('../models/out')
const authModerator = require('../middleware/authModerator')
const authAdmin = require('../middleware/authAdmin')

router.get('/', authModerator, async (req, res) => {
    try {
        const employees = await Employee.findAll()
        res.render('employees', {
            employees,
            title: 'Співробітники',
            isCatalog: true
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

router.post('/edit', authAdmin, async (req, res) => {
    try {
        const {id, name, position, desc} = req.body
        const anyConsumptions = await Consumption.findOne({
            where: {
                employee: id
            }
        })

        if (!anyConsumptions) {
            const item = await Employee.update({name, position, description: desc}, {
                where: {
                    id
                }
            })
        }    
        res.redirect('/employees')
        
        
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

        if (!anyConsumptions) {
            const item = await Employee.destroy({
                where: {
                    id
                }
            })
        }
        res.redirect('/employees')
        
    } catch(e) {
        throw e
    }
})




module.exports = router