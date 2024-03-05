import { Router } from "express";
import UsserMannagerM from "../../dao/db/usserMannagerM.js";
const um = new UsserMannagerM()
const usserRouter = Router()
// create an account 
usserRouter.post("/", async (req, res) =>{
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

    const response = await um.getUsser(ussername)
    if(response.error) return res.status(404).send({message:"username or password invalid"})
    req.session.ussername = response._id
    console.log(req.session)
})
usserRouter.get("/check", (req, res)=>{
    res.send(req.session)
})
usserRouter.get("/logout", (req, res)=>{
    if(!req.session.ussername) return res.redirect("/login")
    req.session.destroy(err => {
        if(err)return res.status(500).send({message: "error while logging out", error:err})
        return res.redirect("/login")
        
    })
})
export default usserRouter