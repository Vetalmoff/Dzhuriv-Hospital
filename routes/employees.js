const {Router} = require('express')
const router = Router()
const Employee = require('../models/employee')


router.get('/', async (req, res) => {
    try {
        const employees = await Employee.findAll()
        res.render('employees', {
            employees,
            title: 'Співробітники',
            isCatalog: true
        })
    } catch(e) {
        res.status(500).render('500')
    }
    
})

router.get('/:id/edit', async (req, res) => {
    try {
        const item = await Employee.findByPk(req.params.id) 
        console.log('Item = ', item)
        res.render('editEmploye', {
            title: 'Редагувати',
            item
        })
    } catch(e) {
        res.status(500).render('500')
    }
})

router.post('/edit', async (req, res) => {
    try {
        const item = Employee.update({name: req.body.name, position: req.body.position, description: req.body.desc}, {
            where: {
                id: req.body.id
            }
        })
        res.redirect('/employees')
    } catch(e) {
        res.status(500).render('500')
    }
})

router.post('/delete', async (req, res) => {
    try {
        const item = Employee.destroy({
            where: {
                id: req.body.id
            }
        })
        res.redirect('/employees')
    } catch(e) {
        res.status(500).render('500')
    }
})




module.exports = router