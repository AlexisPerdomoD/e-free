import  express  from "express"
import productsRouter from "./routes/products/products.routes.js"
import cartRouter from "./routes/carts/carts.routes.js"
import chatRouter from "./routes/chats/chat.route.js"
import { Server } from "socket.io"
import rTPSocketHandler from "./routes/realTimeProducts/RTPSocketHandler.js"
import chatSocketHandler from "./routes/chats/chatSocketHandler.js"
import __dirname from "./getPath.js"
import connectDB from "./utils/connectDB.js"
import eH from "./utils/handlebarsConfig.js"
//App alias server
const app = express()
//these are middlewires 
// to be able to recibe, send and work with json objects in the req.body and res.send 
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
//Go
// set public route
app.use(express.static(__dirname + "/public"))
app.get("/",(req, res)=>{
    res.render('home', {usser:"alexisss"})
})
// connect db 
connectDB("e-comerse")
app.use("/api/products", productsRouter)
app.use("/api/cart", cartRouter)
app.use("/chat", chatRouter)
    
const PORT = 8080
// regular http server by express 
const httpServer = app.listen(PORT, ()=> {
    console.log(`App listening on port ${PORT}`)
})
// server from HTTP server by socket.io for dual way comunication 
//this time used to realTimeProducts end point 
const io = new Server(httpServer)

rTPSocketHandler(io)
chatSocketHandler(io)
