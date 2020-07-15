const {Router} = require('express')
const router = Router()
const Patient = require('../models/patient')


router.get('/', async (req, res) => {
        res.render('addPatient', {
            title: 'Додати пацієнта',
            isAdd: true
        }) 
})


router.post('/', async (req, res) => {
    try {
        console.log( 'Body = ', req.body)
        const newPatient = await Patient.create({
            name: req.body.name,
            age: +req.body.age,
            description: req.body.desc
        })
       
        res.redirect('/patients')
    } catch(e) {
        res.status(500).render('500')
    }

})


module.exports = router