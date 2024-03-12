import { Router} from "express";
import UsserMannagerM from "../../dao/db/usserMannagerM.js";
import { checkPass, signPass } from "../../utils/utils.js";
import passport from "passport";
const um = new UsserMannagerM()
const usserRouter = Router()
// create an account 
usserRouter.post("/", async (req, res) =>{
    req.body.password = signPass(req.body.password)
    const response = await um.setUser(req.body)
    if(response.error) {
        let message ="error in the request"
        if(response.error.code === 11000) message = "these field needs to be unique, it's seems there is an existing usser with it"
        res.status(response.status).send({message: message, ...response})
        return 
    }
    res.redirect("/login")
})
// get an usser logged in 
usserRouter.post("/login", async(req, res) =>{
    const {password, ussername} = req.body
    if(!password || !ussername) return res.status(401).send({error:"error, credentials needed"})

    const usser = await um.getUsser(ussername)
    
    if(usser.status === 404 || !checkPass(password, usser)) return res.status(404).send({message:"username or password invalid"})
    req.session.ussername = usser.email
    req.session.name = req.user.first_name
    req.session.rol = usser.email === "adminCoder@coder.com" ? "admin" : "usser"
    return res.redirect("/products")
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
    passport.authenticate("github", {failureRedirect:"/login"}), 
    (req, res)=>{
    req.session.ussername = req.user.email
    req.session.name = req.user.first_name
    req.session.rol = "usser"
    res.redirect("/products")
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