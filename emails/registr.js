const keys = require('../keys/keys')

module.exports = function(email) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'account was created',
        html: `
        <h1>Привіт!</h1>
        <p>Ви успішно зареєструвалися на сайті Лелеченя, Ваш email : ${email}</p>
        <hr />
        <a href=${keys.BASE_URL}>Лелеченя<a>
        `
    }
}