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
            description: req.body.desc,
            UserId: req.session.user.id
        })
       
        res.redirect('/medicine')
    } catch(e) {
        throw e        
    }

})


module.exports = router