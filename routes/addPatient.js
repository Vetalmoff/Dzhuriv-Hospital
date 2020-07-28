const {Router} = require('express')
const router = Router()
const Patient = require('../models/patient')
const { patientValidators } = require('../middleware/validators')
const { validationResult } = require('express-validator')


router.get('/', async (req, res) => {
        res.render('addPatient', {
            title: 'Додати пацієнта',
            isAdd: true,
            msg: req.flash('errorPatient')
        }) 
})


router.post('/', patientValidators, async (req, res) => {
    try {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('errorPatient', errors.array()[0].msg)
            return res.status(422).redirect('/addPatient')
        }

        console.log( 'Body = ', req.body)
        const newPatient = await Patient.create({
            name: req.body.name,
            dateOfBirdth: req.body.dateOfBirdth,
            description: req.body.desc,
            UserId: req.session.user.id
        })
        req.flash('success', `Пацієнта ${newPatient.name} додано`)
        res.redirect('/patients')
    } catch(e) {
        throw e
    }

})


module.exports = router