import { Router } from 'express'
import { renderCartCtr, renderCommentsCtr, renderProductsCtr } from '../controllers/views/viewsController.js'
import { isUsser } from '../utils/users.midleware.js'

const viewsRouter = Router()

viewsRouter.get('/', (req, res) => {
    res.render('home', {
        usser: req.session ? req.session.name : 'user',
        role: req.session ? req.session.rol : '?'
    })
})
viewsRouter.get('/products', async (req, res, next) => renderProductsCtr(req, res, next))
viewsRouter.get('/cart/', isUsser, async (req, res, next) => renderCartCtr(req, res, next))
viewsRouter.get('/comments/', isUsser, async (req, res, next) => renderCommentsCtr(req, res, next))
viewsRouter.get('/createAccount', (_req, res) => res.render('createAccount'))
viewsRouter.get('/login', (_req, res) => res.render('login'))

export default viewsRouter
