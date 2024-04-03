import {Router} from "express";
import passport from "passport";
import {loginController, logoutController } from "../../controllers/ussers/ussersControllers.js";

const usserRouter = Router()
// SIGN UP
usserRouter.post("/", 
    passport.authenticate("register", {failureRedirect:"/api/usser/error", failureMessage:true}),
    (req, res) => loginController(req, res))
// LOG IN 
usserRouter.post("/login",
    passport.authenticate("login", {failureRedirect:"/api/usser/error", failureMessage:true}),
    (req, res) => loginController(req, res)
)
//CALL GITHUB STRATEGY
usserRouter.get("/github", 
    passport.authenticate("github",  {scope:[ 'user:email' ]}))
//GITHUB STRATEGY CALLBACK
usserRouter.get("/githubcb", 
    passport.authenticate("github", {failureRedirect:"/api/usser/error", failureMessage:true}),
    (req, res)=> loginController(req, res)
)
//LOG OUT 
usserRouter.get("/logout", (req, res)=> logoutController(req, res))

// AUTHENTICATE MIDDLEWARE
export const auth = async (req, res, next) =>{
    if(!req.session.ussername) return res.status(401)
    .render("error", {
        status:401,  
        message: "not authoritation for this route, please log in",
        destiny:" Login",
        redirect: "/login"
    })
    next()
 }
// AUTH ERROR CALLBACK RENDER
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
export default usserRouter