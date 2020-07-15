const {Router} = require('express')
const router = Router()
const Patient = require('../models/patient')


router.get('/', async (req, res) => {
    try {
        const patients = await Patient.findAll()
        console.log(patients)
        res.render('patients', {
            patients,
            title: 'Пацієнти',
            isCatalog: true
        })
    } catch(e) {
        res.status(200).redirect('/')
    }
    
})

router.get('/:id/edit', async (req, res) => {
    try {
        const item = await Patient.findByPk(req.params.id) 
        console.log('Item = ', item)
        res.render('editPatient', {
            title: 'Редагувати',
            item
        })
    } catch(e) {
        res.status(500).render('500')
    }
})

router.post('/edit', async (req, res) => {
    try {
        const item = Patient.update({name: req.body.name, age: req.body.age, description: req.body.desc}, {
            where: {
                id: req.body.id
            }
        })
        res.redirect('/patients')
    } catch(e) {
        res.status(500).render('500')
    }
})

router.post('/delete', async (req, res) => {
    try {
        const item = Patient.destroy({
            where: {
                id: req.body.id
            }
        })
        res.redirect('/patients')
    } catch(e) {
        res.status(500).render('500')
    }
})


module.exports = router