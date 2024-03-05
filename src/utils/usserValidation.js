export const auth = (req, res, next) =>{
    if(!req.session.ussername) return res.status(401).send({error: "not authoritation"}).redirect("/login")
    next()
}