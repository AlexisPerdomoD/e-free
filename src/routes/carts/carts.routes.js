import { Router } from "express"
import ProductManager from "../../dao/ProductManager/productManager.js"
import CartManager from "../../cartManager.js"
import __dirname from "../../getPath.js"

const path = __dirname + "/routes/carts/carts.json"
const cartRouter = Router()
const cm = new CartManager(path)

cartRouter.post("/", async(req, res) =>{    
    await cm.getCarts()
    const cart = await cm.addCart(req.body.products_add)

    res.send({
        message:`cart created properly`,
        content: cart
    })
})

cartRouter.get("/:cid", async(req, res) =>{
        const cart = await cm.getCart(req.params.cid)
        cart
        ? res.send(cart)
        : res.status(404).send({message:"no cart with the given id "+ req.params.cid})
})

cartRouter.post("/:cid/product/:pid", async(req, res) => {
    const pm = new ProductManager("src/routes/products/products.json")
    const product = await pm.getProductById(req.params.pid)
    const cart = await cm.getCart(req.params.cid)
        
        if(cart && product){
            let newCart = await cm.updateCart(cart.id, product)
            res.send({
                message:"product added in cart properly",
                content: newCart
            })
        }else{
            res.status(406).send({message:"not cart or product found, check ids in your request"})
        }
    
})

cartRouter.delete("/delete/:cid", async(req, res) =>{
    const deleteCart = await cm.deleteCart(req.params.cid)

    deleteCart
    ? res.send({
        message:"product deleted",
        content: deleteCart
    })
    : res.status(404).send({
        message:"not found by the id: " + req.params.cid
    })
})


export default cartRouter