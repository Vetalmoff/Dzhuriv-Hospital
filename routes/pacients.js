const {Router} = require('express')
const router = Router()
const Pacient = require('../models/pacient')


router.get('/', async (req, res) => {
    try {
        const pacients = await Pacient.findAll()
        console.log(pacients)
        res.render('pacients', {
            pacients,
            title: 'Пацієнти',
            isCatalog: true
        })
    } catch(e) {
        res.status(200).redirect('/')
    }
    
})

router.get('/:id/edit', async (req, res) => {
    try {
        const item = await Pacient.findByPk(req.params.id) 
        console.log('Item = ', item)
        res.render('editPacient', {
            title: 'Редагувати',
            item
        })
    } catch(e) {
        res.status(500).render('500')
    }
})

router.post('/edit', async (req, res) => {
    try {
        const item = Pacient.update({name: req.body.name, age: req.body.age, description: req.body.desc}, {
            where: {
                id: req.body.id
            }
        })
        res.redirect('/pacients')
    } catch(e) {
        res.status(500).render('500')
    }
})

router.post('/delete', async (req, res) => {
    try {
        const item = Pacient.destroy({
            where: {
                id: req.body.id
            }
        })
        res.redirect('/pacients')
    } catch(e) {
        res.status(500).render('500')
    }
})


module.exports = router