const {Router} = require('express')
const router = Router()
const Medicine = require('../models/medicine')
const Incoming = require('../models/in')
const Consumption = require('../models/out')
const { Op } = require('sequelize')
const dateToView = require('../middleware/dateToView')
const Handlebars = require('handlebars')
const authModerator = require('../middleware/authModerator')
const authAdmin = require('../middleware/authAdmin')
const authSuperAdmin = require('../middleware/authSuperAdmin')






router.get('/', authModerator, async (req, res) => {
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
            if (req.query.isActive) {
                const medicines = await Medicine.findAll({
                    where: {
                        isActive: false
                    }
                })
                medicines.forEach(item => {
                    item.newCreatedAt = dateToView(item.createdAt)
                    item.newUpdatedAt = dateToView(item.updatedAt)
                })
                console.log(medicines)

                res.render('medicine', {
                    medicines,
                    title: 'Списані ліки',
                    isCatalog: true
                })
            } else {
                const medicines = await Medicine.findAll({
                    where: {
                        isActive: true
                    }
                })

                res.render('medicine', {
                    medicines,
                    title: 'Ліки',
                    isCatalog: true
                })
            }
            
        }
        
    } catch(e) {
        throw e
    }
})

router.get('/:id/edit', authAdmin, async (req, res) => {
    try {
        const item = await Medicine.findByPk(req.params.id) 
        console.log('Item = ', item)
        res.render('editMedicine', {
            title: 'Редагувати',
            item
        })
    } catch(e) {
        throw e
    }
})

router.post('/edit', authAdmin, async (req, res) => {
    try {
        const {id, title, desc} = req.body
        const anyIncoming = await Incoming.findByPk(id) 
        const anyConsumption = await Consumption.findByPk(id) 

        if (!anyIncoming || !anyConsumption) {
            const item = await Medicine.update({title, description: desc}, {
                where: {
                    id
                }
            })
            res.status(201).redirect('/medicine')
        } else {
            res.redirect('/medicine')
        }
        
    } catch(e) {
        throw e
    }
})

router.post('/restore', authSuperAdmin, async (req, res) => {
    try {
        const item = await Medicine.update({isActive: true}, {
            where: {
                id: req.body.restoredId
            }
        })
        res.status(201).redirect('/medicine')
    } catch(e) {
        throw e
    }
})

router.post('/delete', authSuperAdmin, async (req, res) => {
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
        throw e
    }
})




module.exports = router