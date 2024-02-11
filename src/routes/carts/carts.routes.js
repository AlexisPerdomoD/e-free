import { Router } from "express"
import MongoMannager from "../../dao/db/MongoMannager.js"
import cartModel from "../../dao/models/cart.model.js"
import productModel from "../../dao/models/product.model.js"

const cartRouter = Router()
const cM = new MongoMannager(cartModel, "cart")

cartRouter.get("/", async(req, res) =>{
    let response = await cM.getColletion()
    response.error 
    ? res.status(500).send(response)
    : res.send(response)
})
cartRouter.post("/", async(req, res) =>{
    const products = req.body ? req.body : {"products":[]}
    const response = await cM.addDocument(products)
    response.error
    ? res.status(400).send(response)
    : res.send(response)
})
cartRouter.get("/:cid", async(req, res) =>{
    const response = await cM.getDocumentById(req.params.cid)
    response.error
    ? res.status(404).send(response)
    : res.send(response)
})
cartRouter.patch("/:cid/product/:pid", async(req, res) => {
    const pM = new MongoMannager(productModel, "product")
    const pMResponse = await pM.getDocumentById(req.params.pid)
    const cMResponse = await cM.getDocumentById(req.params.cid)

    if(pMResponse.error || cMResponse.error){
        res.status(400).send({
            mesage: "there was a problem looking for the product or cart id ",
            product_status: pMResponse,
            cart_status: cMResponse
        })
    }else{
        let products = cMResponse.content.products

        products.find(product => product._id === req.params.pid)
        ? products = products.map(product => {
            if(product._id === req.params.pid){
             product.quantity = req.body.quantity
            }
            return product
        })    
        : products.push({"_id":req.params.pid, "quantity": req.body.quantity})

        let response = await cM.updateDocument(req.params.cid, {products: products})
        response.error
        ? res.status(404).send(response)
        : res.send(response)
    }
})

cartRouter.delete("/delete/:cid", async(req, res) =>{
    const response = await cM.deleteDocumentById(req.params.cid)
    response.error
    ? res.status(404).send(response)
    : res.send(response)
})


export default cartRouter