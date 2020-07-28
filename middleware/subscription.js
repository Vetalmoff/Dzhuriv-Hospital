const User = require('../models/user')
const Consumption = require('../models/out')
const Medicine = require('../models/medicine')
const sequelize = require('../utils/db')
const { Op, where, Sequelize } = require("sequelize")
const sgMail = require('@sendgrid/mail')
const partial = require('../emails/partial')

const toDate = date => {
    return new Intl.DateTimeFormat('uk-UA', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(date))
}



module.exports = async function() {
    
        try {
            const subscribers = await User.findAll({
                where: {
                    subscription: true
                }
            })
            const emails = subscribers.map(item => item.email)
            console.log('emails ==== ', emails)

            const consumptions = await Consumption.findAll({
                attributes: ['MedicineId', [sequelize.fn('sum', sequelize.col('quantity')), 'quantity']],
                group: 'MedicineId',
                where: {
                    createdAt: {[Op.and]: [{[Op.gte]: (Date.now() - (7 * 24 * 3600 * 1000))}, {[Op.lte]: Date.now()}]}
                },
                include: [{
                    model: Medicine,
                    required: true,
                    attributes: ['title', 'isActive']
                }]
            })
    
            emails.forEach( async item => {
                const header = `
                <h1>Звіт по розходу за період : ${toDate(new Date(Date.now() - (7 * 24 * 3600 * 1000)))} по : ${toDate(new Date(Date.now()))}</h1>
                <p></p>
                `

                const html = consumptions.reduce((sum ,elem, index) => sum + `
                    <tr>
                        <th width="50" valign="top">
                            ${++index}
                        </th>
                        <td style="font-size: 1rem; line-height: 0; " width="450">
                            ${elem.Medicine.title}
                        </td>
                        <td style="text-align: center;" width="100" valign="top">
                            ${elem.quantity}
                        </td>
                    </tr>
                `, ``)

            await sgMail.send(partial(item, html, header))
            console.log('message send!!!!!!')
            })
            
        } catch (e) {
            throw e
        }
    
}