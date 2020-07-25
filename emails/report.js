const keys = require('../keys/keys')

module.exports = function(email, html) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: `Звіт по лікам за період`,
        html: `
        <h1>Привіт!</h1>
        ${html}
        <hr />
        <a href=${keys.BASE_URL}>Лелеченя<a>
        `
    }
}