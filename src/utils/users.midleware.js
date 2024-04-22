export function isAdm(req, res, next){
    if(!req.session.ussername || req.session.rol !== "admin"){
        return res.status(401).send({
            message:"error, don't have access to this route",
            status:401,
            error:true
        })
    }
    return next()
}
export function isUsser(req, res, next){
    if(!req.session.ussername || req.session.rol !== "usser"){
        return res.status(401).send({
            message:req.session.rol === "admin" ? "only users have access to this route":"error, don't have required credentials, please log in properly",
            status:401,
            error:true
        })
    }
    console.log("is user activated")
    return next()
}
export function isLogged(req, res, next){
    if(!req.session.ussername){
        return res.status(401).send({
            message:"error, don't have access, need to login",
            status:401,
            error:true
        })
    }
    return next()
}