import CartMannagerM from "../../dao/db/CartMannagerM.js"

const cM = new CartMannagerM()



export async function getCartController(req, res){
    const response = await cM.getCartById(req.session.cart)
    
    if(!response) return res.status(404).send({error:"no cart found"})
    response.error
    ? res.status(response.status).send({message: response?.message || "something went wrong"})
    : res.send(response)
}

export async function updateCartController(req, res){
    if(isNaN(req.body.quantity === undefined || +req.body.quantity) || +req.body.quantity < 0) return res.status(400).send({
        message:"you are not adding any product, bad request", 
        error:true
    })
    const response = await cM.updateCartProduct(req.session.cart, req.params.pid, req.body.quantity)
    response.error
    ? res.status(response.status).send({message: response?.message || "something went wrong"})
    : res.send(response)
}

export async function deleteProductFromCartController(req, res){
    const response = await cM.deleteProductfromCart(req.session.cart, req.params.pid)

    response.error
    ? res.status(response.status).send(response)
    : res.send(response)
}

export async function deleteCart(req, res){
    const response = await cM.deleteCartById(req.params.cid)

    response.error
    ? res.status(response.status).send(response)
    : res.send(response)
}

export async function checkOutCart(req, res){
    const response = await cM.cartCheckOut(req.session.cart)
    response.error
    ? res.status(response.status).send({message: response?.message || "something went wrong"})
    : res.send(response)
}

// cartRouter.post("/", async (req, res) =>{
//     const response = await cM.addCart()
//     response.error
//     ? res.status(400).send(response)
//     : res.send(response)
// })
