const {Router} = require('express')
const router = Router()
const Pacient = require('../models/pacient')


router.get('/', async (req, res) => {
        res.render('addPacient', {
            title: 'Додати пацієнта',
            isAdd: true
        }) 
})


router.post('/', async (req, res) => {
    try {
        console.log( 'Body = ', req.body)
        const newPacient = await Pacient.create({
            name: req.body.name,
            age: +req.body.age,
            description: req.body.desc
        })
       
        res.redirect('/pacients')
    } catch(e) {
        res.status(500).render('500')
    }

})


module.exports = router