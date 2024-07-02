import { um } from '../../dao/index.js'
import em, { ErrorCode } from '../../utils/error.manager.js'
export async function loginController(req, _res, next) {
    try {
        await um.updateUsser(req.user.email, { last_session: new Date() })
        req.session.ussername = req.user.email
        req.session.name = req.user.first_name
        req.session.rol = req.user.rol
        req.session.cart = req.user.cart
        req.session._id = req.user._id
    } catch (err) {
        next(err)
    }
}
export function logoutController(req, res) {
    if (!req.session.ussername) return res.redirect('/login')
    req.session.destroy((err) => {
        if (err)
            throw em.createError({
                name: 'SESION ERROR',
                message: 'error while logging out',
                status: 500,
                code: ErrorCode.DATABASE_ERROR
            })
    })
}
export async function levelUpUserCtr(req, res, next) {
    try {
        await um.updateUsser(req.session.ussername, { rol: 'premium' })
        return res.send({
            ok: true,
            message: 'now you are a premium user'
        })
    } catch (err) {
        next(err)
    }
}
export async function getUssersCtr(req, res, next) {
    try {
        let { page, limit } = req.query
        page = Math.abs(parseInt(page))
        limit = Math.abs(parseInt(limit))
        if (isNaN(page)) page = 1
        if (isNaN(limit)) limit = 10
        return res.send(await um.getUssers({ page, limit }))
    } catch (err) {
        next(err)
    }
}
export async function deleteInnactiveUssersCtr(_req, res, next) {
    try {
        return res.send(await um.deleteInactiveUssers())
    } catch (err) {
        next(err)
    }
}
