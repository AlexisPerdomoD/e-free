import dotenvConfig from "../../config/dotenv.config.js"
import CartMannagerM from "../../dao/db/CartMannagerM.js"
import MongoMannager from "../../dao/db/MongoMannager.js"
import ProductMannagerM from "../../dao/db/ProductMannagerM.js"
import chatModel from "../../dao/models/chat.model.js"

export async function renderProductsC(req, res){
    const pm = new ProductMannagerM()
    const response = await pm.getProductsPaginate({...req.query})
    if(response.error) res.status(response.status).send(response)
    else{
        console.log(dotenvConfig.host)
        response.querys = req.query
        // req.url para despues 
        response.url = `${dotenvConfig.host}/products/`
        res.render("catalogo", {
            products: response.products,
            response: response,
            usser: req.session.name ? req.session.name : "user",
            host2: dotenvConfig.host
        })
    }
}

export async function renderCartC(req, res){
    const cM = new CartMannagerM()
    const response = await cM.getCartById(req.session.cart)

    if(!response) return res.status(404).render("error",{
        status:404,
        message:"not cart found, fatal",
        redirect:"/api/usser/logout",
        destiny: "pls try to logout and sign in again"
    })
    else if(response.error) return res.status(response.status).render("error",{
        status:response.status,
        message:"something went wrong",
        redirect:"/api/usser/logout",
        destiny: "pls try to logout and sign in again"
    })
    // HANDLEBARS NEEDS 
    response.products = response.products.map(product => {return {...product._doc}})
    response.products = response.products.map(product => {return {_id:product._id, quantity: product.quantity, product: {...product.product._doc}}})
    res.render("cart", response)
}

export async function renderCommentsC(req, res){
    const chatM = new MongoMannager(chatModel, "chats")
    let response = await chatM.getColletion()

    response.error
    ? res.status(500).send(response)
    : res.render("chat", {usser:req.session ?  req.session.name : "user", messages: response})
}
