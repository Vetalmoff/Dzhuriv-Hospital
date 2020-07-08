const {Router} = require('express')
const router = Router()
const Medicine = require('../models/medicine')


router.get('/', async (req, res) => {
        res.render('addMedicine', {
            title: 'Додати ліки',
            isAdd: true
        }) 
})


router.post('/', async (req, res) => {
    try {
        const newPreparat = await Medicine.create({
            title: req.body.title,
            description: req.body.desc
        })
       
        res.redirect('/medicine')
    } catch(e) {
        console.log(e.message)
        if (e.message === 'Validation error') {
            res.render('validationError')
        } else {
            res.status(500).render('500')
        }
    }

})


module.exports = router