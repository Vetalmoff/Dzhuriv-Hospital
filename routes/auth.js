const{Router} = require('express')
const { sync } = require('../utils/db')
const router = Router()
const User = require('../models/user')

router.get('/login', async (req, res) => {
    try {
        res.render('auth/login', {
            title: 'Логин',
            isLogin: true
        })
    } catch(e) {
        console.log(e)
    }
})

router.get('/logout', async (req, res) => {
    try {
        req.session.destroy(() => {
            res.redirect('/auth/login#login')
        })
    } catch(e) {
        console.log(e)
    }
})

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                email: 'vetalmoff@gmail.com'
            }
        })
        req.session.isAuthenticated = true
        req.session.user = user
        req.session.save(err => {
            if (err) {
                throw err
            }
            res.redirect('/')
        })

    } catch(e) {
        console.log(e)
    }
})

router.post('/register', async (req, res) => {
    try {

    } catch(e) {
        console.log(e)
    }
})


module.exports = router