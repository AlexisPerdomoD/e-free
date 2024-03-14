import { Router } from "express";
import ProductMannagerM from "../dao/db/ProductMannagerM.js";
import CartMannagerM from "../dao/db/CartMannagerM.js";
import MongoMannager from "../dao/db/MongoMannager.js";
import chatModel from "../dao/models/chat.model.js";
import { auth } from "./ussers/usser.routes.js";

const viewsRouter = Router()

viewsRouter.get("/products", auth, async(req, res)=>{
    const pm = new ProductMannagerM()
    let response = await pm.getProductsPaginate({...req.query})
    if(response.error) res.status(500).send(response)
    else{
        response.querys = req.query
        // req.url  para despues 
        response.url = `http://${req.headers.host}/products/`
        res.render("catalogo", {
            products: response.products,
            response: response,
            usser: req.session.name ? req.session.name : "user"
        })
    }
})

viewsRouter.get("/cart/:cid", auth, async (req, res) =>{
    const cM = new CartMannagerM()
    let response = await cM.getCartById(req.params.cid)
    if(response.status === "error") res.status(400).send(response)
    else{
        // todo esto es por que por alguna razon handlebars no quiere tomar objetos traidos desde mongo a menos que se haga destructuracion // ver luego
         response = response.content._doc
         response.products = response.products.map(product => {return {...product._doc}})
         response.products = response.products.map(product => {return {_id:product._id, quantity: product.quantity, product: {...product.product._doc}}})
         res.render("cart", response)
    }
})

viewsRouter.get("/comments/", auth, async(req, res)=>{
    const chatM = new MongoMannager(chatModel, "chats")
    let response = await chatM.getColletion()
    response.error
    ? res.status(500).send(response)
    : res.render("chat", {usser:req.session ?  req.session.name : "user", messages: response})
})

viewsRouter.get("/createAccount", (req, res) =>{
    res.render("createAccount")
})
viewsRouter.get("/login", (req, res) =>{
    res.render("login")
})
export default viewsRouter