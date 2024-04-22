import { Router } from "express"
import { checkOutCart, deleteCart, deleteProductFromCartController, getCartController, updateCartController } from "../../controllers/carts/cartsController.js"
import { isUsser } from "../../utils/users.midleware.js"
const cartRouter = Router()

//get cart by id
cartRouter.get("/",isUsser, (req, res) => getCartController(req, res))
//update one product in the cart {quantity: Number} if quantity < 1 the product i'll be delete form cart
cartRouter.put("/product/:pid",isUsser, (req, res) =>{
    updateCartController(req, res)
})
//delete product directly
cartRouter.delete("/product/:pid",isUsser, (req, res) => deleteProductFromCartController(req, res))
//delete cart
cartRouter.delete("/delete/:cid",isUsser, (req, res) => deleteCart(req, res))
//checkout
cartRouter.get("/purchase", isUsser, (req, res)=> checkOutCart(req, res))

export default cartRouter