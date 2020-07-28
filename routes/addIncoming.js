const {Router} = require('express')
const router = Router()
const Incoming = require('../models/in')
const Medicine = require('../models/medicine')
const { incomingValidators } = require('../middleware/validators')
const { validationResult } = require('express-validator')

router.get('/', async (req, res) => {
    try {
        const allMedicines = await Medicine.findAll({
            where: {
                isActive: true
            },
            order: ['title']
        })
        res.render('addIncoming', {
            title: 'Прихід',
            isIncoming: true,
            allMedicines,
            msg: req.flash('errorIncoming')
        })
    } catch(e) {
        throw e
    }
})
 
router.post('/', incomingValidators, async (req, res) => {
    try {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('errorIncoming', errors.array()[0].msg)
            return res.status(422).redirect('/addIncoming')
        }

        console.log(req.body)
        const medicine = await Medicine.findOne({
            where: {
                id: req.body.id
            }
        })
        medicine.remainder +=  +req.body.quantity 
        console.log('Medicine quantity = ', medicine.remainder)
        await medicine.save()
        console.log(medicine)

        const incoming = await Incoming.create({
            MedicineId: +req.body.id,
            quantity: +req.body.quantity,
            UserId: req.session.user.id
        })

        res.redirect(`/medicine?page=1&limit=10&isActive=1&order=title&upOrDown=ASC`)

    } catch(e) {
        console.log('message =', e.message)
            throw e      
    }
})

module.exports = router