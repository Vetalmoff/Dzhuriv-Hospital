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
       
        res.redirect(`/medicine?page=1&limit=3&isActive=1&order=title&upOrDown=ASC`)
    } catch(e) {
        throw e        
    }

})


module.exports = router