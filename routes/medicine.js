const {Router} = require('express')
const router = Router()
const Medicine = require('../models/medicine')
const Incoming = require('../models/in')
const Consumption = require('../models/out')
const { Op } = require('sequelize')
const dateToView = require('../middleware/dateToView')
const dateToForm = require('../middleware/dateToForm')
const Handlebars = require('handlebars')
const authModerator = require('../middleware/authModerator')
const authAdmin = require('../middleware/authAdmin')
const authSuperAdmin = require('../middleware/authSuperAdmin')
const pagination = require('../middleware/pagination')
const { medicineValidators } = require('../middleware/validators')
const {validationResult} = require('express-validator')





 
router.get('/', authModerator, pagination(Medicine),  async (req, res) => {
    try {
        req.session.page = +req.query.page
        req.session.limit = +req.query.limit
        req.session.isActive = req.query.isActive
        req.session.order = req.query.order
        req.session.upOrDown = req.query.upOrDown
        const paginationMedicine = res.paginationResult
        if (req.query.title) {
            const items = await Medicine.findAll({
                where: {
                    title: {
                        [Op.like]: `%${req.query.title}%`
                    },
                     isActive: '1'
                },
                order: [
                    ['title', 'ASC']
                ]
            })
            //console.log(items)
            if (items) {
                res.json(items)
            } else {
                res.sendStatus(404)
            }
        } else {
            if (req.query.isActive === '0') {
                paginationMedicine.results.forEach(item => {
                    item.newCreatedAt = dateToView(item.createdAt)
                    item.newUpdatedAt = dateToView(item.updatedAt)
                })
                console.log(paginationMedicine.results)

                res.render('medicine', {
                    limit: +req.query.limit,
                    page: +req.query.page,
                    order: req.query.order,
                    upOrDown: req.query.upOrDown,
                    isActive: req.query.isActive,
                    paginationMedicine,
                    title: 'Списані ліки',
                    isCatalog: true,
                    success: req.flash('success'),
                    error: req.flash('error')
                })
            } else {

                res.render('medicine', {
                    limit: +req.query.limit,
                    page: +req.query.page,
                    order: req.query.order,
                    upOrDown: req.query.upOrDown,
                    paginationMedicine,
                    isActive: req.query.isActive,
                    title: 'Ліки',
                    isCatalog: true,
                    success: req.flash('success'),
                    error: req.flash('error')
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

router.post('/edit', authAdmin, medicineValidators, async (req, res) => {
    try {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('medicineError', errors.array()[0].msg)
            return res.status(422).redirect('/addMedicine')
        }

        const {id, title, desc} = req.body
        const anyIncoming = await Incoming.findOne({
            where: {
                MedicineId: id
            }
        }) 
        const anyConsumption = await Consumption.findOne({
            where: {
                MedicineId: id
            }
        }) 

        if (!anyIncoming || !anyConsumption) {
            const medicine = await Medicine.findByPk(id)
            const item = await Medicine.update({title, description: desc}, {
                where: {
                    id
                }
            })
            req.flash('success', `Ліки ${medicine.title} відредаговано`)
            res.status(201).redirect(`/medicine?page=${req.session.page}&limit=${req.session.limit}&isActive=${req.session.isActive}&order=${req.session.order}&upOrDown=${req.session.upOrDown}`)
        } else {
            req.flash('error', 'Неможливо редагувати ліки, якщо по ним вже є прихід, чи розхід')
            res.redirect(`/medicine?page=${req.session.page}&limit=${req.session.limit}&isActive=${req.session.isActive}&order=${req.session.order}&upOrDown=${req.session.upOrDown}`)
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
        const medicine = await Medicine.findByPk(req.body.restoredId)
         

        req.flash('success', `Ліки ${medicine.title} відновлено`)
        res.status(201).redirect(`/medicine?page=${req.session.page}&limit=${req.session.limit}&isActive=${req.session.isActive}&order=${req.session.order}&upOrDown=${req.session.upOrDown}`)
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
            req.flash('success', `Ліки ${medicine.title} списано`)
            res.status(201).redirect(`/medicine?page=${req.session.page}&limit=${req.session.limit}&isActive=${req.session.isActive}&order=${req.session.order}&upOrDown=${req.session.upOrDown}`)
        } else {
            req.flash('error', 'Щоб списати ліки потрібно, щоб залишок = нулю')
            res.redirect(`/medicine?page=${req.session.page}&limit=${req.session.limit}&isActive=${req.session.isActive}&order=${req.session.order}&upOrDown=${req.session.upOrDown}`)
        }
        
    } catch(e) {
        throw e
    }
})




module.exports = router