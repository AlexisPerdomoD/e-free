import MongoMannager from "../../dao/db/MongoMannager.js"
import chatModel from "../../dao/models/chat.model.js"

export default function chatSocketHandler(io){
    const chatSH = io.of("/chat")

    chatSH.on("connection", async(socket) =>{
        const chatM = new MongoMannager(chatModel, "chat")
        console.log("new usser connected to chat")
        //socket to hear add products requests
        socket.emit("connection", await chatM.getColletion())
        socket.on("send message", async (message)=>{
            const response = await chatM.addDocument(message)
            if(!response.error){
                socket.emit("private", response)
                chatSH.emit("messages", await chatM.getColletion())
            }else{
                socket.emit("private", response)
            }
        })
    })
    return chatSH
}