import express from 'express'
import productsRouter from './routes/products/products.routes.js'
import cartRouter from './routes/carts/carts.routes.js'
import { Server } from 'socket.io'
import chatSocketHandler from './routes/chats/chatSocketHandler.js'
import __dirname from './dirname.js'
import connectDB from './utils/connectDB.js'
import eH from './config/handlebars.config.js'
import viewsRouter from './routes/views.routes.js'
import usserRouter from './routes/ussers/usser.routes.js'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import initializatePassport from './config/passport.config.js'
import passport from 'passport'
import envOptions from './config/dotenv.config.js'
import cors from 'cors'
import { errorMidleware } from './utils/error.manager.js'
import logger, { loggerMidleware } from './config/winston.config.js'
import dotenvConfig from './config/dotenv.config.js'
import swaggerUiExpress from 'swagger-ui-express'
import specs from './config/swagger.config.js'
//App alias server
const app = express()
logger.info(`starting Api mode ${dotenvConfig.mode} port ${dotenvConfig.port} db ${dotenvConfig.persistence}`)
app.use(
    cors({
        origin: dotenvConfig.host,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type'] // Permitir solo el encabezado Content-Type
    })
)
//basic sessions config
app.use(
    session({
        //set mongo store for sessions
        store: MongoStore.create({
            mongoUrl: envOptions.db,
            mongoOptions: {},
            ttl: 100000
        }),
        secret: envOptions.secret,
        resave: false,
        saveUninitialized: false
    })
)
// set public route for static files
app.use(express.static(__dirname + '/public'))
//Handlebars config including helpers using config from config directory
app.engine('handlebars', eH.engine)
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')
//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// set passport middleware authenticate methods
initializatePassport()
app.use(passport.initialize())
app.use(passport.session())
//logger
app.use(loggerMidleware)
// routes
app.use('/', viewsRouter)
app.use('/api/products', productsRouter)
app.use('/api/usser', usserRouter)
app.use('/api/cart', cartRouter)
// documentation by swagger ui
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))
// error final route
app.use(errorMidleware)
// connect db, config in config directory
connectDB(envOptions.db)
const PORT = envOptions.port
// regular http server by express
const httpServer = app.listen(PORT, () => {
    logger.debug(`App listening on port ${PORT}`)
})
// server from HTTP server by socket.io for dual way comunication
//comments sections use it
const io = new Server(httpServer)
chatSocketHandler(io)
