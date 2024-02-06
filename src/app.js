import  express  from "express"
import { engine } from "express-handlebars"
import productsRouter from "./routes/products/products.routes.js"
import cartRouter from "./routes/carts/carts.routes.js"
import __dirname from "./getPath.js"
import { Server } from "socket.io"

// temporal para asignacion
import ProductManager from "./productManager.js"
import productModel from "./models/product.model.js"
const pm = new ProductManager(__dirname + "/routes/products/products.json")

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

app.use("/products", productsRouter)
app.use("/cart", cartRouter)



const PORT = 8080
// regular http server by express 
const httpServer = app.listen(PORT, ()=> {
    console.log(`App listening on port ${PORT}`)
})
// server from HTTP server by socket.io for dual way comunication 
//this time used to realTimeProducts end point 
const socketServer = new Server(httpServer)
socketServer.on("connection", socket =>{
    console.log(`new usser connected by io`)
//socket for hear delete requests
    socket.on("delete", async data =>{

        const deletedProduct = await productModel.findByIdAndDelete(data.id)
        if(deletedProduct){
            socket.emit("private", {
                message: "product deleted id: " + data.id 
            })
            const products = await productModel.find()
            socketServer.emit("productList", products)
            
        }else{
            socket.emit("private", {
                message: "there's not product with the id: " + data.id 
            })
        }
    })
//socket to hear add products requests
    socket.on("addProduct", async (product)=>{
        try {
            let newPerson = new productModel(product)
            const res = {
                message: "product added properly",
                response: await newPerson.save()
            }
            console.log(res.message, res.response)
            socket.emit("private", res)
            const products = await productModel.find()
            socketServer.emit("productList", products)

        } catch (error) {
            console.log(error)
            socket.emit("private", {
                message :"the input does not fullfill the requirements" , content: error.keyValue,
                error: error
            })
        }
    })

})