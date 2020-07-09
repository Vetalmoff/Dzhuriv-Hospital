const {Router} = require('express')
const router = Router()
const Incoming = require('../models/in')
const Medicine = require('../models/medicine')

router.get('/', async (req, res) => {
    try {
        const allMedicines = await Medicine.findAll()
        res.render('addIncoming', {
            title: 'Прихід',
            isIncoming: true,
            allMedicines
        })
    } catch(e) {
        res.render('500')
    }
})

router.post('/', async (req, res) => {
    try {
        console.log(req.body)
        const medicine = await Medicine.findOne({
            where: {
                id: req.body.id
            }
        })
        medicine.count +=  +req.body.quantity 
        console.log('Medicine quantity = ', medicine.count)
        await medicine.save()
        console.log(medicine)

        const incoming = Incoming.create({
            MedicineId: +req.body.id,
            quantity: +req.body.quantity
        })

        res.redirect('/medicine')

    } catch(e) {
        res.render('500')
    }
})

module.exports = router