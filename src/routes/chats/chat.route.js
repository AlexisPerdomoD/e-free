import { Router } from "express"
import MongoMannager from "../../dao/db/MongoMannager.js"
import chatModel from "../../dao/models/chat.model.js"

const chatRouter = Router()
// connect to database 
const chatM = new MongoMannager(chatModel, "chats")

chatRouter.get("/", async(req, res)=>{
    let response = await chatM.getColletion()
    response.error
    ? res.status(400).send(response)
    : res.render("chat", {usser:"alexis", messages: response})
})

export default chatRouter