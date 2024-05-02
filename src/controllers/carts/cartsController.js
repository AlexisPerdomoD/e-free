import CartMannagerM from "../../dao/db/CartMannagerM.js"
import em, { ErrorCode } from "../../utils/error.manager.js"
const cM = new CartMannagerM()

export async function getCartController(req, res) {
    const response = await cM.getCartById(req.session.cart)
    if (cart === null)
        throw em.createError({
            name: "CastError",
            status: 404,
            message: "not cart with the given id",
            code: ErrorCode.GENERAL_USER_ERROR,
        })

    return res.send(response)
}

export async function updateCartController(req, res) {
    if (
        isNaN(req.body.quantity === undefined || +req.body.quantity) ||
        +req.body.quantity < 0
    )
        throw em.createError({
            message: "you are not adding any product, bad request",
            CastError: "Bad Request",
            code: ErrorCode.GENERAL_USER_ERROR,
            status: 400,
        })
    const response = await cM.updateCartProduct(
        req.session.cart,
        req.params.pid,
        req.body.quantity
    )
    return res.send(response)
}

export async function deleteProductFromCartController(req, res) {
    const response = await cM.deleteProductfromCart(
        req.session.cart,
        req.params.pid
    )
    return res.send(response)
}

export async function deleteCart(req, res) {
    const response = await cM.deleteCartById(req.params.cid)
    return res.send(response)
}

export async function checkOutCart(req, res) {
    const response = await cM.cartCheckOut(req.session.cart)
    return res.send({ ...response, user: req.session.ussername })
}

// cartRouter.post("/", async (req, res) =>{
//     const response = await cM.addCart()
//     response.error
//     ? res.status(400).send(response)
//     : res.send(response)
// })
