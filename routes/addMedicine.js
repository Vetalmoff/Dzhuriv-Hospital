const {Router} = require('express')
const router = Router()
const Medicine = require('../models/medicine')
const { medicineValidators } = require('../middleware/validators')
const {validationResult} = require('express-validator')



router.get('/', async (req, res) => {
        res.render('addMedicine', {
            title: 'Додати ліки',
            isAdd: true,
            msg: req.flash('medicineError')
        }) 
})


router.post('/', medicineValidators, async (req, res) => {
    try {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('medicineError', errors.array()[0].msg)
            return res.status(422).redirect('/addMedicine')
        }

        const newPreparat = await Medicine.create({
            title: req.body.title,
            description: req.body.desc,
            UserId: req.session.user.id
        })
       
        req.flash('success', `Ліки ${newPreparat.title} успішно додано`)
        res.redirect(`/medicine?page=1&limit=10&isActive=1&order=title&upOrDown=ASC`)
    } catch(e) {
        throw e        
    }

})


module.exports = router