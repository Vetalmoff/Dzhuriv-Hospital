const {Router} = require('express')
const router = Router()
const Employee = require('../models/employee')


router.get('/', async (req, res) => {
        res.render('addEmployee', {
            title: 'Додати працівника',
            isAdd: true
        }) 
})


router.post('/', async (req, res) => {
    try {
        console.log( 'Body = ', req.body)
        const newEmployee = await Employee.create({
            name: req.body.name,
            position: req.body.position,
            description: req.body.desc,
            UserId: req.session.user.id
        })
       
        res.redirect('/employees')
    } catch(e) {
        res.status(500).render('500')
    }

})


module.exports = router