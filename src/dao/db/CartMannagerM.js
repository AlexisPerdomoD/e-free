import cartModel from "../models/cart.model.js"
import ProductMannagerM from "./ProductMannagerM.js"
import TicketMannager from "./TicketMannager.js"
import em, { ErrorCode } from "../../utils/error.manager.js"
const pm = new ProductMannagerM()

export default class CartMannagerM {
    getCartById(id) {
        return cartModel.findOne({ _id: id })
    }

    async deleteCartById(id) {
        return cartModel.findByIdAndDelete(id)
    }
    async addCart() {
        try {
            let newCart = new cartModel()
            newCart = await newCart.save()
            return {
                message: "cart properly added, id: " + newCart._id,
                content: newCart,
            }
        } catch (error) {
            if (error instanceof Error && error.name === "CastError") {
                return em.createError({
                    name: error.name,
                    message: error.message,
                    code: ErrorCode.GENERAL_USER_ERROR,
                    status: 400,
                    cause: "client problem",
                })
            }
            return em.createError({
                name: "internal error server",
                message: "somethinng when wrong creating the cart",
                status: 500,
                code: ErrorCode.DATABASE_ERROR,
            })
        }
    }
    async deleteProductfromCart(cId, pId) {
        const product = await pm.getProductById(pId)
        if (product === null)
            return em.createError({
                status: 404,
                message: "the product with the given id does not exist",
                name: "CastError",
                code: ErrorCode.GENERAL_USER_ERROR,
            })
        const cart = (await cartModel.find({ _id: cId }))[0]
        if (cart === null)
            return  em.createError({
                name: "CastError",
                status: 404,
                message: "not cart with the given id",
                code: ErrorCode.GENERAL_USER_ERROR,
            })

        if (
            !cart.products.find((product) => product.product.toString() === pId)
        )
            return em.createError({
                name: "CastError",
                status: 404,
                code: ErrorCode.GENERAL_USER_ERROR,
                message: "the product was not found inside the cart",
            })
        cart.products = cart.products.filter(
            (product) => product.product.toString() !== pId
        )
        const response = await cartModel.updateOne(
            { _id: cId },
            { $set: { products: cart.products } }
        )
        return {
            message: "product properly deleted with the id " + pId,
            content: response,
        }
    }
    async updateCartProduct(cId, pId, quantity = 1) {
        const product = await pm.getProductById(pId)
        //return product error
        if (product === null)
            return em.createError({
                name: "CastError",
                message: "the product with the given id does not exist",
                status: 404,
                code: ErrorCode.GENERAL_USER_ERROR,
            })

        const cart = (await cartModel.find({ _id: cId }))[0]
        if (cart === null)
            return em.createError({
                name: "CastError",
                status: 404,
                message: "not cart with the given id",
                code: ErrorCode.GENERAL_USER_ERROR,
            })

        const existingProduct = cart.products.find(
            (item) => item.product.toString() === pId
        )
        quantity = +quantity
        if (!existingProduct && quantity === 0)
            return em.createError({
                message: `the product id:${pId} is not in the cart list`,
                name: "CastError",
                status: 404,
                code: ErrorCode.GENERAL_USER_ERROR,
            })

        if (existingProduct) {
            cart.products =
                quantity === 0
                    ? cart.products.filter(
                          (item) => item.product.toString() !== pId
                      )
                    : (existingProduct.quantity = quantity)
        } else {
            let p = await pm.getProductById(pId)
            cart.products.push({ product: p.content._id, quantity })
        }
        const response = await cartModel.updateOne(
            { _id: cId },
            { $set: { products: cart.products } }
        )
        return {
            message: "cart properly updated",
            content: response,
        }
    }
    async cartCheckOut(cId) {
        let cart = (await cartModel.find({ _id: cId }))[0]
        if (cart.products.length <= 0)
            return em.createError({
                status: 400,
                code: ErrorCode.GENERAL_USER_ERROR,
                message: "the cart does not have any product yet",
                name: "empty cart",
            })

        const ticketInfo = {
            amount: 0,
            products: [],
        }

        for (const p of cart.products) {
            cart = (await cartModel.find({ _id: cId }))[0]
            let product = await pm.getProductById(p.product)
            if (product.status === 404)
                return em.createError({
                    name: "fatal error",
                    message:
                        "there was a product id in this cart that is not in the database",
                    status: 404,
                    code: ErrorCode.GENERAL_USER_ERROR,
                })
            product = product.content

            if (product.stock >= p.quantity) {
                ticketInfo.amount += p.quantity * product.price

                ticketInfo.products.push({
                    product_name: product.title,
                    quantity: p.quantity,
                    product_amount: p.quantity * product.price,
                    price: product.price,
                })

                await pm.updateProduct(product._id, {
                    stock: product.stock - p.quantity,
                })

                const newProducts = cart.products.filter(
                    (pr) => pr.product.toString() !== product._id.toString()
                )
                await cartModel.findByIdAndUpdate(
                    cId,
                    { products: newProducts },
                    { new: true }
                )
            }
        }

        if (ticketInfo.products.length <= 0)
            return {
                ticket: null,
                message:
                    "there is not stock for any of your products right now",
            }

        const tm = new TicketMannager()
        const ticket = await tm.addTicket(ticketInfo)
        cart = (await cartModel.find({ _id: cId }))[0]
        return {
            message:
                cart.products.length > 0
                    ? "there were some missing stock for some of your products, they are still on the cart for the future"
                    : "all products were properly included in your order",
            ticket,
        }
    }
}
