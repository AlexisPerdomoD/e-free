import { Router } from "express"
import ProductMannagerM from "../../dao/db/ProductMannagerM.js"
const productsRouter = Router()
//CONECT TO PRODUCTS COLLECTION
const pm = new ProductMannagerM()

// SEND CATALOGO 
productsRouter.get("/show", async(req,res)=>{
    let response = await pm.getProductsPaginate({...req.query})
    if(response.error) res.status(500).send(response)
    else{
        response.querys = req.query
        response.url = "http://localhost:8080/api/products/show"
        res.render("catalogo", {
            products: response.products,
            response: response
        })
    }
})
productsRouter.get("/", async (req,res)=>{

    //sort limit page to (para seleccionar otro campo para implementar sort, por defecto price) y querys adicionales
    let response = await pm.getProductsPaginate(req.query)
    if(response.error) res.status(500).send(response)
    else{
        res.send(response)
    }
})

productsRouter.get("/realTimeProducts", async(req, res) =>{
    let response = await pm.getProducts()
    response.error
    ? res.status(500).send(response)
    : res.send({products: response})
})
// SEND PRODUCT BY ID
productsRouter.get("/:pid", async(req, res)=>{
    let id = req.params.pid
    let response = await pm.getProductById(id)
    ! response.error 
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
productsRouter.patch("/update_product/:pid", async(req , res) =>{
    let id = req.params.pid
    let updates = req.body
    let response = await pm.updateProduct(id, updates)
    !response.error 
    ? res.send(response) 
    : res.status(404).send(response)
})

export default productsRouter
