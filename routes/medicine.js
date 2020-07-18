const {Router} = require('express')
const router = Router()
const Medicine = require('../models/medicine')
const { Op } = require('sequelize')


router.get('/', async (req, res) => {
    try {
        if (req.query.title) {
            const items = await Medicine.findAll({
                where: {
                    title: {
                        [Op.like]: `%${req.query.title}%`
                    },
                     isActive: true
                }
            })
            console.log(items)
            if (items) {
                res.json(items)
            } else {
                res.sendStatus(404)
            }
        } else {
            const medicines = await Medicine.findAll({
                where: {
                    isActive: true
                }
            })
            //console.log('MEDICINES = ', medicines)
            res.render('medicine', {
                medicines,
                title: 'Ліки',
                isCatalog: true
            })
        }
        
    } catch(e) {
        res.status(500).render('500')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const item = await Medicine.findByPk(req.params.id) 
        console.log('Item = ', item)
        res.render('editMedicine', {
            title: 'Редагувати',
            item
        })
    } catch(e) {
        res.status(500).render('500')
    }
})

router.post('/edit', async (req, res) => {
    try {
        const item = await Medicine.update({title: req.body.title, description: req.body.desc}, {
            where: {
                id: req.body.id
            }
        })
        res.status(201).redirect('/medicine')
    } catch(e) {
        res.status(500).render('500')    
    }
})

router.post('/delete', async (req, res) => {
    try {
        const medicine = await Medicine.findByPk(req.body.id)
        if (medicine.remainder === 0) {
            const item = await Medicine.update({isActive: false},{
                where: {
                    id: req.body.id
                }
            })
            res.status(201).redirect('/medicine')
        } else {
            res.redirect('/medicine')
        }
        
    } catch(e) {
        res.status(500).render('500')
    }
})




module.exports = router