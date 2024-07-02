// NOT IMPLEMENTED
//import ProductMannagerM from "../../dao/db/ProductMannagerM.js"
////  to do aqui no se debe enviar datos al cliente sino del respectivo rpoduct router
//export default function rTPSocketHandler(io) {
//    const rTPSH = io.of("/realTimeProducts")
//
//    rTPSH.on("connection", (socket) =>{
//        const pm = new ProductMannagerM()
//        console.log(`new usser connected by io to real time products`)
//        //socket for hear delete requests
//        socket.on("delete", async data =>{
//            const response = await pm.getProductById(data.id)
//            if(!response.error){
//                socket.emit("private", response)
//                rTPSH.emit("productList", await pm.getProducts())
//            }else{
//                socket.emit("private", response)
//            }
//        })
//        //socket to hear add products requests
//        socket.on("addProduct", async (product)=>{
//            const response = await pm.addProduct(product)
//            if(!response.error){
//                socket.emit("private", response)
//                rTPSH.emit("productList", await pm.getProducts())
//            }else{
//                socket.emit("private", response)
//            }
//        })
//    })
//
//    return rTPSH
//}
