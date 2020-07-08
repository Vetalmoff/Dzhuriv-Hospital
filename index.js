const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const sequelize = require('./utils/db')
const homeRoutes = require('./routes/home')
const medicineRouter = require('./routes/medicine')
const employeesRouter = require('./routes/employees')
const pacientRouter = require('./routes/pacients')
const addMedicineRouter = require('./routes/addMedicine')
const addEmployeeRouter = require('./routes/addEmployee')
const addPacientRouter = require('./routes/addPacient')

const PORT = process.env.PORT || 3000

app.engine('hbs', exphbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main',
    extname: 'hbs'
}));

app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:false}))


app.use('/', homeRoutes)
app.use('/medicine', medicineRouter)
app.use('/employees', employeesRouter)
app.use('/pacients', pacientRouter)
app.use('/addMedicine', addMedicineRouter)
app.use('/addEmployee', addEmployeeRouter)
app.use('/addPacient', addPacientRouter)


async function start() {
    try {
        await sequelize.sync();
        console.log('Connection has been established successfully.');
        app.listen(PORT, () => console.log(`server started on port ${PORT}`))
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

start()

  
