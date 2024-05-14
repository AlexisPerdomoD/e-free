import { Router } from "express"
import { checkOutCart, deleteProductFromCartController, getCartController, updateCartController } from "../../controllers/carts/cartsController.js"
import { isUsser } from "../../utils/users.midleware.js"
const cartRouter = Router()

//get cart by id
cartRouter.get("/",isUsser, async (req, res, next) => getCartController(req, res, next))
//update one product in the cart {quantity: Number} if quantity < 1 the product i'll be delete form cart
cartRouter.patch("/product/:pid",
    isUsser,
    async (req, res, next) => updateCartController(req, res, next)
)
//delete product directly
cartRouter.delete("/product/:pid",
    isUsser, 
    async (req, res, next) => deleteProductFromCartController(req, res, next)
)
//checkout
cartRouter.get("/purchase", 
    isUsser, 
    async(req, res, next)=> checkOutCart(req, res, next))

export default cartRouter
