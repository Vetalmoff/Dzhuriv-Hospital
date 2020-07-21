const express = require('express')
const app = express()
const { DB, user, password, host, port } = require('./keys/keys')
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
const usersRouter = require('./routes/users')
const errorHandler404 = require('./middleware/errorHandler404')
const authRouter = require('./routes/auth')
const varMiddleware = require('./middleware/variables')
const MySQLStore = require('express-mysql-session')(session)
const auth = require('./middleware/auth')
const csurf = require('csurf')




const PORT = process.env.PORT || 3000

app.engine('hbs', exphbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: require('./utils/hbd-helpers')
}));

app.set('view engine', 'hbs')
app.set('views', 'views')
const sessionStore = new MySQLStore({
  host,
  port,
  user,
  password,
  database: DB
})




app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(session({
  store: sessionStore,
  key: 'session_cookie_name',
  secret: 'session_cookie_secret',
  resave: false,
  saveUninitialized: false
}))
app.use(csurf())
app.use(varMiddleware)



app.use('/', homeRoutes)
app.use('/medicine', auth, medicineRouter)
app.use('/employees', auth, employeesRouter)
app.use('/patients', auth, patientRouter)
app.use('/addMedicine', auth, addMedicineRouter)
app.use('/addEmployee', auth, addEmployeeRouter)
app.use('/addPatient', auth, addPatientRouter)
app.use('/addIncoming', auth, addIncomingRouter)
app.use('/addConsumption', auth, addConsumptionRouter)
app.use('/inReport', auth, InRerportRouter)
app.use('/outReport', auth, outReportRouter)
app.use('/auth', authRouter)
app.use('/users', usersRouter)

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

  
