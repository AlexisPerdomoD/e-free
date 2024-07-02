import dotenvConfig from '../../config/dotenv.config.js'
import { cm, commentsM, pm } from '../../dao/index.js'

export async function renderProductsCtr(req, res, next) {
    try {
        const response = await pm.getProductsPaginate({ ...req.query })

        response.querys = req.query
        // req.url para despues
        response.url = `${dotenvConfig.host}/products/`
        res.render('catalogo', {
            products: response.products,
            response: response,
            usser: req.session.name ? req.session.name : 'user',
            host2: dotenvConfig.host
        })
    } catch (err) {
        next(err)
    }
}

export async function renderCartCtr(req, res, next) {
    try {
        const response = await cm.getCartById(req.session.cart)

        if (!response)
            return res.status(404).render('error', {
                status: 404,
                message: 'not cart found, fatal',
                redirect: '/api/usser/logout',
                destiny: 'pls try to logout and sign in again'
            })
        // HANDLEBARS NEEDS
        response.products = response.products.map((product) => {
            return { ...product._doc }
        })
        response.products = response.products.map((product) => {
            return { _id: product._id, quantity: product.quantity, product: { ...product.product._doc } }
        })
        res.render('cart', response)
    } catch (err) {
        next(err)
    }
}

export async function renderCommentsCtr(req, res, next) {
    try {
        res.render('chat', {
            usser: req.session ? req.session.name : 'user',
            messages: await commentsM.getColletion()
        })
    } catch (err) {
        next(err)
    }
}
