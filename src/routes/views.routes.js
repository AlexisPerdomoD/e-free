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
viewsRouter.get('/products', renderProductsCtr)
viewsRouter.get('/cart/', isUsser, renderCartCtr)
viewsRouter.get('/comments/', isUsser, renderCommentsCtr)
viewsRouter.get('/createAccount', (_req, res) => res.render('createAccount'))
viewsRouter.get('/login', (_req, res) => res.render('login'))

export default viewsRouter
