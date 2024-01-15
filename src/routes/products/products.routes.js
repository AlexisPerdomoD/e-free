import { Router } from "express"
import ProductManager from "../../productManager.js"

const pm = new ProductManager("src/routes/products/products.json")
const productsRouter = Router()



// SEND CATALOGO 
productsRouter.get("/", async(req,res)=>{
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
productsRouter.get("/:pid",async(req, res)=>{
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
productsRouter.delete("/delete/:pid", async(req, res) =>{
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
 productsRouter.post("/add_product", async(req, res) =>{
    let {tittle, description, price, category, thumbnail, code , stock} = req.body
    if(!tittle || !description || !price || !category || !thumbnail || !code || !stock){
        res.status(406).send({message:"in order to add a new file every field must be filled properly"})
    }else{
        res.send(await pm.addProduct(tittle, description, price, category, thumbnail, code, stock)) 
        
    }
})

export default productsRouter
