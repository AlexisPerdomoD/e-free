import { Router } from "express"
import connectDB from "../../connectDB.js"
import ProductManagerMongo from "../../dao/ProductManagerMongo/ProductManagerMongo.js"
const productsRouter = Router()
//CONECT TO PRODUCTS COLLECTION
connectDB("products")
const pm = new ProductManagerMongo("products")

// SEND CATALOGO 
productsRouter.get("/", async(req,res)=>{
    let limit = req.query.limit
    let response = await pm.getProducts()
    if(response.error){
        res.status(500).send(response)
    }else{
        if(limit){
            res.render("catalogo", {
                products: response.filter((product, index) => index < limit && product )
            })
        }else{
            res.render("catalogo", {
                usser:"Alexis🔥",
                products: response
            })
        }
    }
})
productsRouter.get("/realTimeProducts", async(req, res) =>{
    let response = await pm.getProducts()
    response.error
    ? res.status(500).send(response)
    : res.render('realTimeProducts',{
        products : response,
        usser: "Alexis🔥"
    })
})
// SEND PRODUCT BY ID
productsRouter.get("/:pid",async(req, res)=>{
    let id = req.params.pid
    let response = await pm.getProductById(id)
    !response.error 
    ? res.send(response)
    : res.status(404).send(response)
})

// Delete product by id 
productsRouter.delete("/delete/:pid", async(req, res) =>{
    //params return an string
    let id = req.params.pid
    let response = await pm.deleteProductById(id)
    !response.error 
    ? res.send(response) 
    : res.status(404).send(response)
})
// add new product 
 productsRouter.post("/add_product", async(req, res) =>{
    let response = await pm.addProduct(req.body)
    !response.error 
    ? res.send(response) 
    : res.status(400).send(response)
})
// update product by id 
productsRouter.put("/update_product/:pid", async(req , res) =>{
    let id = req.params.pid
    let updates = req.body
    let response = await pm.updateProduct(id, updates)
    !response.error 
    ? res.send(response) 
    : res.status(404).send(response)
})

export default productsRouter
