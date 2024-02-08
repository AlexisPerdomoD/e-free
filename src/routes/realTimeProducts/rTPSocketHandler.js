import MongoMannager from "../../dao/db/MongoMannager.js"
import productModel from "../../dao/models/product.model.js"

export default function rTPSocketHandler(io) {
    const rTPSH = io.of("/realTimeProducts")

    rTPSH.on("connection", (socket) =>{
        const pm = new MongoMannager(productModel, "product")
        console.log(`new usser connected by io to real time products`)
        //socket for hear delete requests
        socket.on("delete", async data =>{
            const response = await pm.deleteDocumentById(data.id)
            if(!response.error){
                socket.emit("private", response)
                rTPSH.emit("productList", await pm.getColletion())
            }else{
                socket.emit("private", response)
            }
        })
        //socket to hear add products requests
        socket.on("addProduct", async (product)=>{
            const response = await pm.addDocument(product)
            if(!response.error){
                socket.emit("private", response)
                rTPSH.emit("productList", await pm.getColletion())
            }else{
                socket.emit("private", response)
            }
        })
    })
    
    return rTPSH
}