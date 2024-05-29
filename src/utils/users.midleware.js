import errorManager from "./error.manager.js"


export function isAdm(req, _res, next) {
    if (!req.session.ussername || req.session.rol !== "admin") return errorManager.generateAuthorizationError()
    return next()
}
export function isUsser(req, _res, next) {
    if (!req.session.ussername || req.session.rol === "admin") return errorManager.generateAuthorizationError()
    return next()
}
export function isLogged(req, _res, next) {
    if (!req.session.ussername) return errorManager.generateAuthenticationError()
    return next()
}

export function isPremium(req, _res, next) {
    if (!req.session || req.session.rol !== "premium") return errorManager.generateAuthorizationError()
    return next()
}
