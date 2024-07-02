import { Router } from 'express'
import passport from 'passport'
import { deleteInnactiveUssersCtr, getUssersCtr, levelUpUserCtr, loginController, logoutController } from '../../controllers/ussers/ussersControllers.js'
import em, { ErrorCode } from '../../utils/error.manager.js'
import { isLogged } from '../../utils/users.midleware.js'
const usserRouter = Router()
// GET USSERS INFO #public for now but will be only for admins
usserRouter.get('/', getUssersCtr)
// DELETE INACTIVE USSERS #public for now but will be only for admins
usserRouter.delete('/', deleteInnactiveUssersCtr)
// SIGN UP  POST api/usser
usserRouter.post(
    '/',
    passport.authenticate('register', {
        failureMessage: true
    }),
    (req, res) => {
        loginController(req, res)
        res.send({
            ok: true,
            message: 'session properly started and user created'
        })
    }
)
//SIGN UP VIEW  POST api/usser/template
usserRouter.post(
    '/template',
    passport.authenticate('register', {
        failureRedirect: '/api/usser/error_template',
        failureMessage: true
    }),
    (req, res) => {
        loginController(req, res)
        res.redirect('/products')
    }
)
// LOG IN POST api/usser/login
usserRouter.post(
    '/login',
    passport.authenticate('login', {
        failureMessage: true
    }),
    (req, res) => {
        loginController(req, res)
        res.send({
            ok: true,
            message: 'session properly started'
        })
    }
)
// LOG IN template POST api/usser/login_template
usserRouter.post(
    '/login_template',
    passport.authenticate('login', {
        failureRedirect: '/api/usser/error_template',
        failureMessage: true
    }),
    (req, res) => {
        loginController(req, res)
        res.redirect('/products')
    }
)
//CALL GITHUB STRATEGY, needs to use browser GET api/usser/github
usserRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }))
//GITHUB STRATEGY CALLBACK GET api/usser/githubcb
usserRouter.get(
    '/githubcb',
    passport.authenticate('github', {
        failureRedirect: '/api/usser/error',
        failureMessage: true
    }),
    (req, res) => loginController(req, res)
)
//LOG OUT GET api/usser/logout
usserRouter.get('/logout', (req, res) => {
    logoutController(req, res)
    res.send({ ok: true, message: 'logged out' })
})
//LOG OUT TEMPLATE GET api/usser/logout_template
usserRouter.get('/logout_template', (req, res) => {
    logoutController(req, res)
    res.redirect('/')
})

// AUTH ERROR CALLBACK GET api/usser/error
usserRouter.get('/error', (req, _res) => {
    throw em.createError({
        status: 400,
        message: req.session.messages
            ? req.session.messages
            : 'problem detected to get credentials properly, pls try again',
        name: 'CastError',
        code: ErrorCode.GENERAL_USER_ERROR
    })
})
// AUTH ERROR CALLBACK RENDER TEMPLATE GET api/usser/error_template
usserRouter.get('/error_template', (req, res) => {
    res.render('error', {
        status: 401,
        message: req.session.messages
            ? req.session.messages[0]
            : 'problem detected to get credentials properly, pls try again',
        redirect: '/login',
        destiny: 'login'
    })
})
export default usserRouter
// UPGRADE TO PREMIUM GET api/usser/premium
usserRouter.get('/premium', isLogged, (req, res, next) => levelUpUserCtr(req, res, next))

// AUTHENTICATE MIDDLEWARE reference, now using users.midleware.js on utils directory
// export const auth = async (req, res, next) =>{
//     if(!req.session.ussername) return res.status(401)
//     .render("error", {
//         status:401,
//         message: "not authoritation for this route, please log in",
//         destiny:" Login",
//         redirect: "/login"
//     })
//     next()
//  }
