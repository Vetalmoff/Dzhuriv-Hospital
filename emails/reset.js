const keys = require('../keys/keys')


module.exports = (email, token) => {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Відновлення пароля',
        html: `
        <h1>Привіт!</h1>
        <p>Ви хочете встановити новий пароль?</p>
        <p>Якщо ні, то проігноруйте цей лист</p>
        <p>інакше перейдіть по посиланню  <a href="${keys.BASE_URL}auth/password/${token}">Відновити доступ</a></p>
        <hr />
        <a href=${keys.BASE_URL}>Лелеченя<a>
        `
    }
        
}