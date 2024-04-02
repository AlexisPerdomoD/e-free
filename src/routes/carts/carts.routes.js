import { Router } from "express"
import { deleteCart, deleteProductFromCartController, getCartController, updateCartController } from "../../controllers/carts/cartsController.js"
const cartRouter = Router()

//get cart by id
cartRouter.get("/", (req, res) => getCartController(req, res))
//update one product in the cart {quantity: Number} if quantity < 1 the product i'll be delete form cart
cartRouter.put("/product/:pid", (req, res) => updateCartController(req, res))
//delete product directly
cartRouter.delete("/product/:pid", (req, res) => deleteProductFromCartController(req, res))
//delete cart
cartRouter.delete("/delete/:cid", (req, res) => deleteCart(req, res))

export default cartRouter