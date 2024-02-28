import { Router } from "express"
import CartMannagerM from "../../dao/db/CartMannagerM.js"

const cartRouter = Router()
const cM = new CartMannagerM()

cartRouter.get("/:cid/show", async (req, res) =>{
    let response = await cM.getCartById(req.params.cid)
    if(response.status === "error") res.status(500).send(response)
    else{
        // todo esto es por que por alguna razon handlebars no quiere tomar objetos traidos desde mongo a menos que se haga destructuracion // ver luego
  
         response = response.content._doc
         response.products = response.products.map(product => {return {...product._doc}})
         response.products = response.products.map(product => {return {_id:product._id, quantity: product.quantity, product: {...product.product._doc}}})
         res.render("cart", response)
    }
})
//get all carts
cartRouter.get("/", async (req, res) =>{
    let response = await cM.getCarts()
    response.error 
    ? res.status(500).send(response)
    : res.send(response)
})
// create a new cart with or without products ()
cartRouter.post("/", async (req, res) =>{
    const cartToAdd = req.body.cart
    const response = await cM.addCart(cartToAdd)
    response.error
    ? res.status(400).send(response)
    : res.send(response)
})
//get cart by id
cartRouter.get("/:cid", async(req, res) =>{
    const response = await cM.getCartById(req.params.cid)
    response.status === "error"
    ? res.status(404).send(response)
    : res.send(response)
})
//update one product in the cart {quantity: Number} if quantity < 1 the product i'll be delete form cart
cartRouter.put("/:cid/product/:pid", async(req, res) => {
    const response = await cM.updateCartProduct(req.params.cid, req.params.pid, req.body.quantity)
    response.error
    ? res.status(404).send(response)
    : res.send(response)
})
//delete product directly
cartRouter.delete("/:cid/product/:pid", async(req, res) => {
    const response = await cM.deleteProductfromCart(req.params.cid, req.params.pid)
    response.error
    ? res.status(404).send(response)
    : res.send(response)
})

//delete cart
cartRouter.delete("/delete/:cid", async(req, res) =>{
    const response = await cM.deleteCartById(req.params.cid)
    response.error
    ? res.status(404).send(response)
    : res.send(response)
})


export default cartRouter