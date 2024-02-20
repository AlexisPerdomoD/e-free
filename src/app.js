import  express  from "express"
import { engine } from "express-handlebars"
import productsRouter from "./routes/products/products.routes.js"
import cartRouter from "./routes/carts/carts.routes.js"
import __dirname from "./getPath.js"
import { Server } from "socket.io"
// temporal para asignacion
import rTPSocketHandler from "./routes/realTimeProducts/RTPSocketHandler.js"
import chatRouter from "./routes/chats/chat.route.js"
import chatSocketHandler from "./routes/chats/chatSocketHandler.js"
//App alias server
const app = express()
//these are middlewires 
// to be able to recibe, send and work with json objects in the req.body and res.send 
app.use(express.json())
// necessary configuration needed for reciving req.body properly by url encode 
// to let the app knows it'll recive any kind of value (objects included)
app.use(express.urlencoded({extended:true}))
// set config to use express-handlerbars as render ingine 
app.engine("handlebars", engine())
//setear engine 
app.set("view engine", "handlebars")
// setear ruta a las vistas 
app.set("views", __dirname + "/views")
//Go
// static files
app.use(express.static(__dirname + "/public"))
app.get("/",(req, res)=>{
    res.render('home', {usser:"alexisss"})
})

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
