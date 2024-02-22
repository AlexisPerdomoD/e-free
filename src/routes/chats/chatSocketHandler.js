import MongoMannager from "../../dao/db/MongoMannager.js"
import chatModel from "../../dao/models/chat.model.js"

export default function chatSocketHandler(io){
    const chatSH = io.of("/chat")
    const chatM = new MongoMannager(chatModel, "chat")

    chatSH.on("connection", async (socket) =>{
        console.log("new usser connected to chat id: "+ socket.id)
        //socket to hear add products requests
        socket.emit("connection", {message: "welcome to our comment section"} )
        socket.on("send message", async (message)=>{
            try {
                let response = await chatM.addDocument(message)
                if(!response.error){
                    socket.emit("private", {message: "your message was sent"})
                    chatSH.emit("messages", await chatM.getColletion())
                }else{
                    socket.emit("private",  response)
                }
            } catch (error) {
                
            }
        })
    })
    return chatSH
}