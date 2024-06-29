import { sendDeleteProductEmail } from '../../config/mailer.config.js'
import UsserMannagerM from '../../dao/db/usserMannagerM.js'
import { pm } from '../../dao/index.js'
import em, { ErrorCode } from '../../utils/error.manager.js'
const um = new UsserMannagerM()
export async function getProductsController(req, res, next) {
    try {
        const response = await pm.getProductsPaginate(req.query)
        return res.send(response)
    } catch (err) {
        next(err)
    }
}

export async function getProductController(req, res, next) {
    try {
        const response = await pm.getProductById(req.params.pid)
        return res.send(response)
    } catch (err) {
        next(err)
    }
}

export async function deleteProductController(req, res, next) {
    try {
        //params.pid return an string
        const response = await pm.deleteProductById(req.params.pid)
        const deletedProduct = response.content
        // CHECKS IF THE PRODUCT IS FROM A PREMIUM USSER
        if (typeof deletedProduct.owner === 'string' && deletedProduct.owner !== 'admin') {
            const usser = await um.getUsserById(deletedProduct.owner)
            // CHECKS IF PREMIUM USSER HAS A VALID EMAIL  and SEND EMAIL
            const EMAIL_REGEX = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/
            console.log(usser)
            EMAIL_REGEX.test(usser.email) && console.log(await sendDeleteProductEmail(deletedProduct, usser))
        }
        return res.send(response)
    } catch (err) {
        next(err)
    }
}
export async function addProductController(req, res, next) {
    try {
        const { title, description, price, category, code, thumbnail, status, stock } = req.body
        if (!title || !description || !price || !category || !code)
            em.generateProductError({
                title,
                description,
                price,
                category
            })
        if (typeof category !== 'string') em.generateValidationDataError('category', 'category must by an string')

        const productInfo = {
            title,
            description,
            price,
            category: category.trim().toLowerCase()
        }
        if (typeof thumbnail === 'string') productInfo.thumbnail = thumbnail
        if (typeof status === 'boolean') productInfo.status = status
        if (typeof stock === 'number' && stock >= 0) productInfo.stock = stock
        productInfo.owner = req.session.rol === 'admin' ? 'admin' : req.session._id
        const response = await pm.addProduct(productInfo)
        return res.send(response)
    } catch (err) {
        next(err)
    }
}

export async function updateProductController(req, res, next) {
    try {
        const updateblesFields = ['title', 'description', 'price', 'stock', 'thumbnail', 'status', 'category', 'code']
        const updates = {}
        for (const field of updateblesFields) {
            if (req.body[field]) updates[field] = req.body[field]
        }
        if (Object.entries(updates).length === 0)
            throw em.createError({
                error: 'Bad Request',
                message: 'there is any valid field to be update',
                status: 400,
                code: ErrorCode.GENERAL_USER_ERROR
            })

        const response = await pm.updateProduct(req.params.pid, updates)
        return res.send(response)
    } catch (err) {
        next(err)
    }
}
// controllers for premium users
export async function updateProductByOwnerCtr(req, res, next) {
    try {
        const product = (await pm.getProductById(req.params['pid'])).content
        if (!product)
            throw em.createError({
                error: 'NOT FOUND',
                status: 404,
                code: ErrorCode.GENERAL_USER_ERROR,
                message: 'product not found with the given id'
            })
        if (product.owner !== req.session._id)
            throw em.createError({
                error: 'Authoritazion Error',
                message: 'product does not belong to your account',
                status: 403,
                code: ErrorCode.NOT_AUTHORIZATION
            })

        await updateProductController(req, res, next)
    } catch (err) {
        next(err)
    }
}

export async function deleteProductByOwnerCtr(req, res, next) {
    try {
        const product = (await pm.getProductById(req.params['pid'])).content
        if (!product)
            throw em.createError({
                error: 'NOT FOUND',
                status: 404,
                code: ErrorCode.GENERAL_USER_ERROR,
                message: 'product not found with the given id'
            })
        if (product.owner !== req.session._id)
            throw em.createError({
                error: 'Authoritazion Error',
                message: 'product does not belong to your account',
                status: 403,
                code: ErrorCode.NOT_AUTHORIZATION
            })
        const response = await pm.deleteProductById(req.params.pid)
        const deletedProduct = product
        if (typeof deletedProduct.owner === 'string' && deletedProduct.owner !== 'admin') {
            const usser = await um.getUsserById(deletedProduct.owner)
            // CHECKS IF PREMIUM USSER HAS A VALID EMAIL  and SEND EMAIL
            const EMAIL_REGEX = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/
            EMAIL_REGEX.test(usser.email) && await sendDeleteProductEmail(deletedProduct, usser, 'Product deleted by owner')
        }
        return res.send(response)
    } catch (err) {
        next(err)
    }
}
