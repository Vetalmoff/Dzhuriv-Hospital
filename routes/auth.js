const{Router} = require('express')
const { sync } = require('../utils/db')
const router = Router()
const bcrypt = require('bcryptjs')
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
        const {email, password} = req.body

        const candidate = await User.findOne({
            where: {
                email
            }
        })

        if (candidate) {
            const areTheSame = await bcrypt.compare(password, candidate.password)
            if (areTheSame) {
                req.session.isAdmin = true
                req.session.user = candidate
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                    res.redirect('/')
                })
            } else {
                res.redirect('/auth/login#login')
            }
        } else {
            res.redirect('/auth/login#login')
        }
        

    } catch(e) {
        console.log(e)
    }
})

router.post('/register', async (req, res) => {
    try {
        const {name, email, password, passwordConfirm} = req.body
        const candidate = await User.findOne({where: {
            email
        }})

        if (candidate) {
            res.redirect('/auth/login#register')
        } else {
            const hashPassword = await bcrypt.hash(password, 10)
            const user = await User.create({
                name,
                email,
                password: hashPassword
            })

            res.redirect('/auth/login#login')
        }

    } catch(e) {
        console.log(e)
    }
})


module.exports = router