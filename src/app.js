import express  from "express"
import productsRouter from "./routes/products/products.routes.js"
import cartRouter from "./routes/carts/carts.routes.js"
import { Server } from "socket.io"
import chatSocketHandler from "./routes/chats/chatSocketHandler.js"
import __dirname from "./dirname.js"
import connectDB from "./utils/connectDB.js"
import eH from "./config/handlebars.config.js"
import viewsRouter from "./routes/views.routes.js"
import usserRouter from "./routes/ussers/usser.routes.js"
import session from "express-session"
import MongoStore from "connect-mongo"
import initializatePassport from "./config/passport.config.js"
import passport from "passport"
import envOptions from "./config/dotenv.config.js"
import cors from "cors"
import {errorMidleware} from "./utils/error.manager.js"
//App alias server
const app = express()
console.log(envOptions)
app.use(cors({
    origin: '*', // Permitir cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type'], // Permitir solo el encabezado Content-Type
  }));
//basic sessions config
app.use(session({
    //set mongo store for sessions
    store: MongoStore.create({
        mongoUrl: envOptions.db,
        mongoOptions:{},
        ttl:100000
    }),
secret: envOptions.secret,
    resave:false,
    saveUninitialized:false
}))
//these are middlewires 
// to be able to recive, send and work with json objects in the req.body and res.send 
// necessary configuration needed for reciving req.body properly by url encode 
// to let the app knows it'll recive any kind of value (objects included)
app.use(express.json())
app.use(express.urlencoded({extended:true}))
// set public route
app.use(express.static(__dirname + "/public"))
//eH confg con helpers importada de otro archivo
app.engine("handlebars", eH.engine)
//setear engine 
app.set("view engine", "handlebars")
// setear ruta a las vistas
app.set("views", __dirname + "/views")
app.get("/", (req, res)=>{
    res.render('home', {usser: req.session ?  req.session.name : "", role: req.session ?  req.session.rol : ""})
})
// set passport middleware authenticate methods
initializatePassport()
app.use(passport.initialize())
app.use(passport.session())
// connect db 
connectDB(envOptions.db)
// routes
app.use("/", viewsRouter)
app.use("/api/products", productsRouter)
app.use("/api/usser", usserRouter)
app.use("/api/cart", cartRouter)
app.use(errorMidleware)
const PORT = envOptions.port
// regular http server by express 
const httpServer = app.listen(PORT, ()=> {
    console.log(`App listening on port ${PORT}`)
})
// server from HTTP server by socket.io for dual way comunication 
//comments sections use it
const io = new Server(httpServer)

// rTPSocketHandler(io) real time products end point not longer used
chatSocketHandler(io)
