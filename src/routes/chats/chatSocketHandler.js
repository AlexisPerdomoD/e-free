import MongoMannager from "../../dao/db/MongoMannager"
import chatModel from "../../dao/models/chat.model"

export default function chatSocketHandler(io){
    const chatSH = io.of("/chat")

    chatSH.on("connection", socket =>{
        const chatM = new MongoMannager(chatModel, "chat")
        console.log("new usser connected to chat")
        //socket to hear add products requests
        socket.on("send message", async (message)=>{
            const response = await chatM.addDocument(message)
            if(!response.error){
                socket.emit("private", response)
                rTPSH.emit("messages", await chatM.getColletion())
            }else{
                socket.emit("private", response)
            }
        })
    })
    return chatSH
}