const {Router} = require('express')
const router = Router()
const { Op } = require("sequelize");
const User = require('../models/user')

router.get('/', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role'],
            where: {
                role: {
                    [Op.not]: 'superAdmin'
                }
            },
            order: ['name']
        })

        

        res.render('users', {
            users,
            msg: req.flash('success')
        })
    } catch (e) {
        throw e
    }
})

router.post('/:id', async (req, res) => {
    try {
        console.log('req.body ============= ', req.body)
        console.log('req.params ============= ', req.params)

        const updateUser = await User.update({role: req.body.role}, {
            where: {
                id: req.params.id
            }
        })

        const user = await User.findByPk(req.params.id)
        console.log('updateUser = ', user)
        req.flash('success', `Для користувача -   ${user.email}   встановлено доступ -   ${user.role}`)
        res.redirect('/users')

    } catch(e) {
        throw e
    }
})



module.exports = router