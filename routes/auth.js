const{Router} = require('express')
const { sync } = require('../utils/db')
const {validationResult} = require('express-validator')
const router = Router()
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const User = require('../models/user')
const keys = require('../keys/keys.dev')
const sgMail = require('@sendgrid/mail')
const regEmail = require('../emails/registr')
const resetEmail = require('../emails/reset')
const { Op } = require('sequelize')
const {registerValidators, loginValidators} = require('../middleware/validators')
sgMail.setApiKey(keys.sendGrid)




router.get('/login', async (req, res) => {
    try {
        res.render('auth/login', {
            title: 'Логин',
            isLogin: true,
            loginError: req.flash('loginError'),
            registerError: req.flash('registerError'),
            success: req.flash('success')
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
                switch (candidate.role) {
                    case 'user':
                        req.session.isUser = true
                        break
                    case 'moderator':
                        req.session.isModerator = true
                        break
                    case 'admin':
                        req.session.isAdmin = true
                        break
                    case 'superAdmin':
                        req.session.isSuperAdmin = true
                        break
                }
                req.session.role = candidate.role
                req.session.user = candidate
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                    console.log('req.session ================== ', req.session)
                    res.redirect('/')
                })
            } else {
                req.flash('loginError', 'Користувача з такою поштою не існує')
                res.redirect('/auth/login#login')
            }
        } else {
            req.flash('loginError', 'Користувача з такою поштою не існує')
            res.redirect('/auth/login#login')
        }
        

    } catch(e) {
        console.log(e)
    }
})

router.post('/register', registerValidators, async (req, res) => {
    try {
        const {name, email, password} = req.body

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('registerError', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#register')
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            name,
            email,
            password: hashPassword
        })

        await sgMail.send(regEmail(email))
        
        req.flash('success', 'Ви успішно зареєструвалися')
        res.redirect('/auth/login#login')

    } catch(e) {
        console.log(e)
    }
})

router.get('/reset', (req, res) => {
    try {
        res.render('auth/reset', {
            title: 'Відновлення пароля',
            isLogin: true,
            error: req.flash('error')
        })
    } catch(e) {
        throw e
    }
})

router.post('/reset', (req, res) => {
    try {
        const {email} = req.body
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('error', 'Спробуйте ше раз')
                return res.redirect('/auth/reset')
            }
            const token = buffer.toString('hex')
            const candidate = await User.findOne({
                where: {
                    email
                }
            })
            if (candidate) {
                candidate.resetToken = token
                candidate.resetTokenExp = Date.now() + 3600 * 1000
                await candidate.save()
                await sgMail.send(resetEmail(candidate.email, token))
                req.flash('success', 'Вам надіслано листа на електронну пошту')
                res.redirect('/auth/login')
            } else {
                req.flash('error', 'Не має користувача з такою поштою')
                return res.redirect('/auth/reset')
            }
        })

    } catch (e) {
        throw e
    }
    
})

router.get('/password/:token', async (req, res) => {
    if (!req.params.token) {
        req.flash('loginError', 'Спробуйте ще раз')
        return res.redirect('/auth/login')
    }

    try {
        const user = await User.findOne({
            where: {
                resetToken: req.params.token,
                resetTokenExp: {
                    [Op.gt]: Date.now()
                }
            }
        })

        if (!user) {
            req.flash('loginError', 'Спробуйте ще раз')
            res.redirect('auth/login')
        } else {
            res.render('auth/password', {
                title: 'Відновлення пароля',
                isLogin: true,
                error: req.flash('error'),
                userId: user.id,
                token: req.params.token
            })
        }
        
    } catch (e) {
        throw e
    }
    
})

router.post('/password', async (req, res) => {
    try {
        const { password, userId, token } = req.body
        const user = await User.findOne({
            where: {
                id: userId,
                resetToken: token,
                resetTokenExp: {
                    [Op.gt]: Date.now()
                }
            }
        })

        if (user) {
            user.password = await bcrypt.hash(password, 10)
            user.resetToken = null
            user.resetTokenExp = null
            await user.save()
            req.flash('success', 'Пароль успішно змінено!')
            res.redirect('/auth/login')
        } else {
            req.flash('loginError', 'Час життя токена вийшов, спробуйте ще раз')
            res.redirect('/auth/login')
        }
    } catch (e) {
        throw e
    }
})

module.exports = router