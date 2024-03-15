import { Router} from "express";
import passport from "passport";
const usserRouter = Router()
// create an account 
usserRouter.post("/", 
    passport.authenticate("register", {failureRedirect:"/api/usser/error", failureMessage:true}),
    async (req, res) =>{
        req.session.ussername = req.user.email
        req.session.name = req.user.first_name
        req.session.rol = req.user.rol
        req.session.cart = req.user.cart
        res.redirect("/")
    })
// get an usser logged in 
usserRouter.post("/login",
    passport.authenticate("login", {failureRedirect:"/api/usser/error", failureMessage:true}),
    async (req, res) =>{
        req.session.ussername = req.user.email
        req.session.name = req.user.first_name
        req.session.rol = req.user.rol
        req.session.cart = req.user.cart
        return res.redirect("/")
})

//for now using for both
usserRouter.get("/error", (req, res ) => {
    res.render("error", {
        status:401,
        message:req.session.messages
        ? req.session.messages.join(" ")
        : "problem detected to get credentials properly, pls try again",
        redirect: "/login",
        destiny: "login"
    })
})

usserRouter.get("/logout", (req, res)=>{
    if(!req.session.ussername) return res.redirect("/login")
    req.session.destroy(err => {
        if(err)return res.status(500).send({message: "error while logging out", error:err})
        return res.redirect("/login")
    })
})
//end point to call github authentication, not funtion needed 
usserRouter.get("/github", 
    passport.authenticate("github",  {scope:[ 'user:email' ]}))
// end point after succes authentication from github 
usserRouter.get("/githubcb", 
    passport.authenticate("github", {failureRedirect:"/api/usser/error", failureMessage:true}), 
    (req, res)=>{
        req.session.ussername = req.user.email
        req.session.name = req.user.first_name
        req.session.rol = req.user.rol
        req.session.cart = req.user.cart
    res.redirect("/")
})







 export const auth = async (req, res, next) =>{
      if(!req.session.ussername)
      return res.status(401).render("error", {
         status:401,  
         message: "not authoritation for this route, please log in",
         destiny:" Login",
         redirect: "/login"
         })

    next()
 }
export default usserRouter