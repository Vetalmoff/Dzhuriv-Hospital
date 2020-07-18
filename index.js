const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const Handlebars = require('handlebars')
const path = require('path')
const session = require('express-session')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const sequelize = require('./utils/db')
const homeRoutes = require('./routes/home')
const medicineRouter = require('./routes/medicine')
const employeesRouter = require('./routes/employees')
const patientRouter = require('./routes/patients')
const addMedicineRouter = require('./routes/addMedicine')
const addEmployeeRouter = require('./routes/addEmployee')
const addPatientRouter = require('./routes/addPatient')
const addIncomingRouter = require('./routes/addIncoming')
const addConsumptionRouter = require('./routes/addConsumption')
const InRerportRouter = require('./routes/InReport')
const outReportRouter = require('./routes/OutReport')
const errorHandler404 = require('./middleware/errorHandler404')
const authRouter = require('./routes/auth')
const varMiddleware = require('./middleware/variables')

const PORT = process.env.PORT || 3000

app.engine('hbs', exphbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main',
    extname: 'hbs'
}));

app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(session({
  secret: 'some secret value',
  resave: false,
  saveUninitialized: false
}))
app.use(varMiddleware)


app.use('/', homeRoutes)
app.use('/medicine', medicineRouter)
app.use('/employees', employeesRouter)
app.use('/patients', patientRouter)
app.use('/addMedicine', addMedicineRouter)
app.use('/addEmployee', addEmployeeRouter)
app.use('/addPatient', addPatientRouter)
app.use('/addIncoming', addIncomingRouter)
app.use('/addConsumption', addConsumptionRouter)
app.use('/inReport', InRerportRouter)
app.use('/outReport', outReportRouter)
app.use('/auth', authRouter)

app.use(errorHandler404)


async function start() {
    try {
        await sequelize.sync()
        console.log('Connection has been established successfully.')
        app.listen(PORT, () => console.log(`server started on port ${PORT}`))
      } catch (error) {
        console.error('Unable to connect to the database:', error)
      }
}

start()

  
