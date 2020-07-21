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
            dateOfBirdth: req.body.dateOfBirdth,
            description: req.body.desc,
            UserId: req.session.user.id
        })
       
        res.redirect('/patients')
    } catch(e) {
        throw e
    }

})


module.exports = router