import { Router } from "express"
import connectDB from "../../utils/connectDB.js"
import MongoMannager from "../../dao/db/MongoMannager.js"
import chatModel from "../../dao/models/chat.model.js"

const chatRouter = Router()
// connect to database 
connectDB("chats")
const chatM = new MongoMannager(chatModel, "chats")

chatRouter.get("/", async(req, res)=>{
    let response = await chatM.getColletion()
    response.error
    ? res.status(400).send(response)
    : res.render("chat", {usser:"alexis", chats: response})
})

export default chatRouter