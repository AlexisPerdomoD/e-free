import  express  from "express"
import ProductManager from "./productManager.js"
const pm = new ProductManager()
const server = express()
const port = 8080


server.get("/",(req, res)=>{
    res.send("<h1> Hi world, we're using express server</h1>")
})
// SEND CATALOGO 
server.get("/products", async(req,res)=>{
    let response = await pm.getProducts()
    res.send(response)
})
// SEND PRODUCT BY ID
server.get("/products/:pid",async(req, res)=>{
    let id = req.params.pid
    let response = await pm.getProductById(id)
    response ? res.send(response) : res.send({"error":`not such product with the id:${id}`})
})



server.listen(port, ()=> {
    console.log(`App listening on port ${port}`)
})