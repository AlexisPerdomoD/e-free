import  express  from "express"
import { engine } from "express-handlebars"
import productsRouter from "./routes/products/products.routes.js"
import cartRouter from "./routes/carts/carts.routes.js"

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
//corregir rutas relativas luego
// setear ruta a las vistas 
app.set("views", "src/views")

//Go
app.get("/",(req, res)=>{
    res.render('home', {usser:"alexisss"})
})

app.use("/products", productsRouter)
app.use("/cart", cartRouter)


const PORT = 8080
app.listen(PORT, ()=> {
    console.log(`App listening on port ${PORT}`)
})