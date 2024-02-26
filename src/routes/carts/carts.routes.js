import { Router } from "express"
import CartMannagerM from "../../dao/db/CartMannagerM.js"

const cartRouter = Router()
const cM = new CartMannagerM()

cartRouter.get("/:cid/show", async (req, res) =>{
    let response = await cM.getCartById(req.params.cid)
    if(response.error) res.status(500).send(response)
    else{
        // todo esto es por que por alguna razon handlebars no quiere tomar objetos traidos desde mongo a menos que se haga destructuracion // ver luego
        response = response.content._doc
        response.products = response.products.map(product => {return {...product._doc}})

        response.products = response.products.map(product => {return {_id:product._id, quantity: product.quantity, product: {...product.product._doc}}})

        res.render("cart", response)
    }
})
cartRouter.get("/", async(req, res) =>{
    let response = await cM.getCarts()
    response.error 
    ? res.status(500).send(response)
    : res.send(response)
})
cartRouter.post("/", async(req, res) =>{
    const response = await cM.addCart(req.body.products)
    response.error
    ? res.status(400).send(response)
    : res.send(response)
})
cartRouter.get("/:cid", async(req, res) =>{
    const response = await cM.getCartById(req.params.cid)
    response.error
    ? res.status(404).send(response)
    : res.send(response)
})
cartRouter.patch("/:cid/product/:pid", async(req, res) => {
    // REQ.BODY ONLY RECIVES {quantity: Number} to update or add the product in te products property from cart 
    const response = await cM.updateCartProduct(req.params.cid, req.params.pid, req.body.quantity)
    response.error
    ? res.status(404).send(response)
    : res.send(response)
})

cartRouter.delete("/delete/:cid", async(req, res) =>{
    const response = await cM.deleteCartById(req.params.cid)
    response.error
    ? res.status(404).send(response)
    : res.send(response)
})


export default cartRouter