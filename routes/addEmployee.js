const {Router} = require('express')
const router = Router()
const Employee = require('../models/employee')
const { employeeValidators } = require('../middleware/validators')
const { validationResult } = require('express-validator')


router.get('/', async (req, res) => {
        res.render('addEmployee', {
            title: 'Додати працівника',
            isAdd: true,
            msg: req.flash('errorEmployee')
        }) 
})


router.post('/', employeeValidators, async (req, res) => {
    try {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('errorEmployee', errors.array()[0].msg)
            return res.status(422).redirect('/addEmployee')
        }

        console.log( 'Body = ', req.body)
        const newEmployee = await Employee.create({
            name: req.body.name,
            position: req.body.position,
            description: req.body.desc,
            UserId: req.session.user.id
        })
        req.flash('success', `Співробітника ${newEmployee.name} додано`)
        res.redirect('/employees')
    } catch(e) {
        throw e
    }

})


module.exports = router