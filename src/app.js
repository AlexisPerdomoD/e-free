import express  from "express"
import productsRouter from "./routes/products/products.routes.js"
import cartRouter from "./routes/carts/carts.routes.js"
import { Server } from "socket.io"
import chatSocketHandler from "./routes/chats/chatSocketHandler.js"
import __dirname from "./getPath.js"
import connectDB from "./utils/connectDB.js"
import eH from "./utils/handlebarsConfig.js"
import viewsRouter from "./routes/views.routes.js"
import usserRouter, { auth } from "./routes/ussers/usser.routes.js"
import session from "express-session"
import MongoStore from "connect-mongo"
import initializatePassport from "./config/passport.config.js"
import passport from "passport"
//App alias server
const app = express()
//basic sessions config
app.use(session({
    //set mongo store for sessions
    store: MongoStore.create({
        //env
        mongoUrl:"mongodb+srv://sixela__develop:n3HVKf1n4SAFH7MP@clutster0.xg9qfiw.mongodb.net/e-comerse-server",
        mongoOptions:{},
        ttl:100000
    }),
    //env 
secret:"secret",
    resave:false,
    saveUninitialized:false
}))
//these are middlewires 
// to be able to recive, send and work with json objects in the req.body and res.send 
// necessary configuration needed for reciving req.body properly by url encode 
// to let the app knows it'll recive any kind of value (objects included)
app.use(express.json())
app.use(express.urlencoded({extended:true}))
//eH confg con helpers importada de otro archivo
app.engine("handlebars", eH.engine)
//setear engine 
app.set("view engine", "handlebars")
// setear ruta a las vistas
app.set("views", __dirname + "/views")
app.get("/", (req, res)=>{
    res.render('home', {usser: req.session ?  req.session.name : ""})
})

// set public route
app.use(express.static(__dirname + "/public"))
// set passport middleware authenticate methods
initializatePassport()
app.use(passport.initialize())
app.use(passport.session())
// connect db 
//env 
connectDB("e-comerse")
// routes
app.use("/api/products", auth, productsRouter)
app.use("/api/usser", usserRouter)
app.use("/api/cart", auth, cartRouter)
app.use("/", viewsRouter)
//env 
const PORT = 8080
// regular http server by express 
const httpServer = app.listen(PORT, ()=> {
    console.log(`App listening on port ${PORT}`)
})
// server from HTTP server by socket.io for dual way comunication 
//comments sections use it
const io = new Server(httpServer)

// rTPSocketHandler(io) real time products end point not longer used
chatSocketHandler(io)
