import  express  from "express"
import ProductManager from "./productManager.js"
const pm = new ProductManager()


//App alias server
const server = express()
// necessary configuration needed for reciving req.body properly by url encode 
//(basicly traslating from a given string to the necesary querys we'd need for post put and delete request)
// to be able to recibe json objects in the req.body
server.use(express.json())
// to let the app knows it'll recive any kind of value (objects included)
server.use(express.urlencoded({extended:true}))
const port = 8080
server.listen(port, ()=> {
    console.log(`App listening on port ${port}`)
})

server.get("/",(req, res)=>{
    res.status(200).send({
        message:"main page",
        content:"<h1> Hi world, we're using express server</h1>"
    })
})
// SEND CATALOGO 
server.get("/products", async(req,res)=>{
    let limit = req.query.limit
    let response = await pm.getProducts()
    if(limit){
        res.send({
            message:`products recived with limit ${limit}`,
            content:response.filter((product, index) => index < limit && product )
        })
    }else{
        res.send({
            message:`products recived all`,
            content:response
        })
    }
})
// SEND PRODUCT BY ID
server.get("/products/:pid",async(req, res)=>{
    let id = req.params.pid
    let response = await pm.getProductById(id)
    response ? 
    res.send({
        message: "product found",
        content: response
    }) 
    : res.status(404).send({
        message:`not such product with the id:${id}`
    })
})

// Delete product by id 
server.delete("/products/delete/:pid", async(req, res) =>{
    //params return an string
    let id = +req.params.pid
    let response = await pm.deleteProduct(id)
    console.dir(response)
    response ? 
    res.send({
        message: `deleted`,
        content: response
    }) 
    : res.status(404).send({
        message:`not such product with the id:${id}`
    })
    
})
server.post("/add_product", (req, res) =>{
    if(!req.body){
        
    }
})


