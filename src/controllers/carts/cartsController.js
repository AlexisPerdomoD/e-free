import { cm } from '../../dao/index.js'
import em, { ErrorCode } from '../../utils/error.manager.js'

export async function getCartController(req, res, next) {
    try {
        const response = await cm.getCartById(req.session.cart)
        if (response === null)
            throw em.createError({
                name: 'CastError',
                status: 404,
                message: 'not cart with the given id',
                code: ErrorCode.GENERAL_USER_ERROR,
                cause: 'not found'
            })

        return res.send(response)
    } catch (err) {
        next(err)
    }
}

export async function updateCartController(req, res, next) {
    try {
        if (req.body.quantity === undefined || isNaN(+req.body.quantity) || +req.body.quantity < 0)
            em.generateValidationDataError(
                'quantity',
                'expected type number higher or equal to 0, got: ' + req.body.quantity
            )
        const response = await cm.updateCartProduct(req.session.cart, req.params.pid, req.body.quantity)
        return res.send(response)
    } catch (err) {
        next(err)
    }
}

export async function deleteProductFromCartController(req, res, next) {
    try {
        const response = await cm.deleteProductfromCart(req.session.cart, req.params.pid)
        return res.send(response)
    } catch (err) {
        next(err)
    }
}

export async function checkOutCart(req, res, next) {
    try {
        const response = await cm.cartCheckOut(req.session.cart)
        return res.send({ ...response, user: req.session.ussername })
    } catch (err) {
        next(err)
    }
}
