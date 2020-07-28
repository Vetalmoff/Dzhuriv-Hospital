const keys = require('../keys/keys.dev')

module.exports = function(email, html, header) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'report',
        html: `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <title>Demystifying Email Design</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            </head>
            <body style="margin: 0; padding: 0;">
                <table align="center" border="1" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;">
                    <tr>
                        <td align="center">
                            <img src="https://media2.giphy.com/media/3o7TKz2eMXx7dn95FS/giphy.gif" alt="Creating Email Magic" width="600"  style="display: block;" />
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#a6edff" align="center" style="font-family: arial,sans-serif; margin: 10; padding: 10;">
                        ${header}
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#a6edff" style="padding: 40px 30px 40px 30px;">
                            <table border="1" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td>
                                        <table border="1" cellpadding="0" cellspacing="0" width="100%">
                                                <tr>
                                                    <th style="text-align: center;">#</th>
                                                    <th>Назва</th>
                                                    <th>Кількість</th>
                                                </tr>
                                                ${html}
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            <a href=${keys.BASE_URL}>Лелеченя<a>
        </html>
                `
    }
}