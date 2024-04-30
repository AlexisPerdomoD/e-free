import em from "../../utils/error.manager.js"
export function loginController(req, res){
    req.session.ussername = req.user.email
    req.session.name = req.user.first_name
    req.session.rol = req.user.rol
    req.session.cart = req.user.cart
    res.redirect("/")
}

export function logoutController(req, res){
    if(!req.session.ussername) return res.redirect("/login")
    req.session.destroy(err => {
        if(err)throw em.createError({
            name:"SESION ERROR",
            message:"error while logging out",
            status:500
        })
    res.redirect("/login")
    })
}
