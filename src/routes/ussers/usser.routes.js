import { Router } from "express";
import UsserMannagerM from "../../dao/db/usserMannagerM.js";
const um = new UsserMannagerM()
const usserRouter = Router()

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

export default usserRouter