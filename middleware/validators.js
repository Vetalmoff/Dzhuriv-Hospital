const {body} = require('express-validator')
const User = require('../models/user')


module.exports.registerValidators = [
    body('email')
        .isEmail().withMessage('Введіть корректний email')
        .custom(async (value, {req})=> {
            try {
                const user = await User.findOne({
                    where: {
                        email: value
                    }
                })   
                console.log(user)
                if (user) {
                    return Promise.reject('Ця пошта вже зайнята')
                }
            } catch (e) {
                throw e
            }
        })
        .normalizeEmail(),
    body('password', 'Пароль повинен бути щонайменше 6 символів, максимум 20 символів')
        .isLength({min: 6, max: 20})
        .isAlphanumeric()
        .trim(),
    body('name', 'Ім"я повинно бути щонайменше 3 символа')
        .isLength({min:3})
        .trim()
]

module.exports.medicineValidators = [
    body('title', 'Назва повинна бути щонайменше 3 символа')
        .isLength({min:3})
        .trim(),
    body('desc', 'Опис повинен бути щонайменше 3 символа')
        .isLength({min:3})
        .trim()
]

module.exports.patientValidators = [
    body('name', "Ім'я повинне бути щонайменше 3 символа")
        .isLength({min:3})
        .trim(),
    body('desc', 'Опис повинен бути щонайменше 3 символа')
        .isLength({min:3})
        .trim(),
    body('dateOfBirdth', 'Тут має бути дата')
        .isDate()
]

module.exports.employeeValidators = [
    body('name', "Ім'я повинне бути щонайменше 3 символа")
        .isLength({min:3})
        .trim(),
    body('position', 'Посада повинна бути щонайменше 3 символа')
        .isLength({min:3})
        .trim(),
    body('desc', 'Опис повинен бути щонайменше 3 символа')
        .isLength({min:3})
        .trim(),
    
]

module.exports.incomingValidators = [
    body('quantity', 'Ви ввели не число')
        .isNumeric({min: 1})
]

module.exports.consumptionValidators = [
    body('quantity', 'Ви ввели не число')
        .isNumeric({min: 1})
]

module.exports.userValidators = [
    body('name', "Ім'я повинне бути щонайменше 3 символа")
        .isLength({min:3})
        .trim()
    
]