const {Router} = require ('express')
const router = Router()
const authUser = require('../middleware/authUser')
const User = require('../models/user')
const { userValidators } = require('../middleware/validators')
const { validationResult } = require('express-validator')

router.get('/', authUser, (req, res) => {
    res.render('profile', {
        isProfile: true,
        title: 'Профіль',
        user: req.session.user,
        success: req.flash('success'),
        error: req.flash('errorUser')
    })
})

router.post('/', userValidators, async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('errorUser', errors.array()[0].msg)
            return res.status(422).redirect('/profile')
        }

        const {name, id} = req.body
        console.log(name, id)
        await User.update({name}, {
            where: {
                id
            }
        })
        const newUser = await User.findByPk(id)
        req.session.user = newUser
        req.flash('success', "Ім'я змінено")
        res.redirect('/profile')
    } catch (e) {
        throw e
    }
    
})


module.exports = router