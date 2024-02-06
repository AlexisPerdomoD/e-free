import { Router } from "express"
import __dirname from "../../getPath.js"
import productModel from "../../models/product.model.js"
import connectDB from "../../connectDB.js"

const path = __dirname + "/routes/products/products.json"
const productsRouter = Router()
//CONECT TO PRODUCTS COLLECTION
connectDB("e-comerse-server/products")

// SEND CATALOGO 
productsRouter.get("/", async(req,res)=>{
    let limit = req.query.limit
    let response = await productModel.find()
    response = response.map(product => {
        return {
            title: product.title, 
            description: product.description, 
            thumbnail: product.thumbnail, 
            price: product.price
        }
    })
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
})
productsRouter.get("/realTimeProducts", async(req, res) =>{
    let response = await productModel.find()
    response = response.map(product => {
        return {
            title: product.title, 
            description: product.description, 
            thumbnail: product.thumbnail, 
            price: product.price
        }
    })
    res.render('realTimeProducts',{
        products : response,
        usser: "Alexis🔥"
    })
})
// SEND PRODUCT BY ID
productsRouter.get("/:pid",async(req, res)=>{
    let id = req.params.pid
    let response = await productModel.findById(id)
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
    let id = req.params.pid
    let response = await productModel.findByIdAndDelete(id)
    response ? 
    res.send({
        message: `deleted`,
        content: response
    }) 
    : res.status(404).send({
        message:`not such product with the id:${id}`
    })
})
// add new product 
 productsRouter.post("/add_product", async(req, res) =>{
    let {tittle, description, price, category, thumbnail, code , stock} = req.body
    if(!tittle || !description || !price || !category || !thumbnail || !code){
        res.status(406).send({message:"in order to add a new file every field must be filled properly"})
    }else{
        try {
            let response = await productModel.insert(req.body)
            res.send(response)
        } catch (error) {
            console.error(error)
            res.send(error)
        }
    }
})
// update product by id 
productsRouter.put("/update_product/:pid", async(req , res) =>{
    let id = req.params.pid
    try {
        let response = await productModel.updateOne({_id: id}, {$set: req.body})
        res.send(response)
        console.log(response)
    } catch (error) {
        res.send(error)
    }
        
})

export default productsRouter
