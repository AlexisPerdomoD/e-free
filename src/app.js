import  express  from "express"
import productsRouter from "./routes/products/products.routes.js"
import cartRouter from "./routes/carts/carts.routes.js"

//App alias server
const server = express()
//these are middlewires 
// necessary configuration needed for reciving req.body properly by url encode 
//(basicly traslating from a given string to the necesary querys we'd need for post put and delete request)
// to be able to recibe json objects in the req.body
// to let the app knows it'll recive any kind of value (objects included)
server.use(express.json())
server.use(express.urlencoded({extended:true}))

server.get("/",(req, res)=>{
    res.status(200).send({
        message:"main page",
        content:"<h1> Hi world, we're using express server</h1>"
    })
})
server.use("/products", productsRouter)
server.use("/cart", cartRouter)
const PORT = 8080
server.listen(PORT, ()=> {
    console.log(`App listening on port ${PORT}`)
})