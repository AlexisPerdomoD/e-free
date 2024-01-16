import { Router } from "express"
import fs from "fs"
import crypto from "crypto"

const cartRouter = Router()
const path = "src/routes/carts/carts.json"


cartRouter.post("/", async(req, res) =>{
    const cart = {
        id: crypto.randomBytes(16).toString("hex"),
        products:[]
    }

    if(req.body.products_add){
        req.body.products_add.forEach(product => cart.products.push(product))
    }

    !fs.existsSync(path) && await fs.promises.writeFile(path, JSON.stringify([]))

    const carts = JSON.parse(await fs.promises.readFile(path, "utf-8"))
    carts.push(cart)
    await fs.promises.writeFile(path, JSON.stringify(carts))

    res.send({
        message:`cart created properly`,
        id: cart.id,
        "status cart":cart.products
    })
})

cartRouter.get("/:cid", async(req, res) =>{
    if(fs.existsSync(path)){
        const carts = JSON.parse(await fs.promises.readFile(path, "utf-8"))

        carts.find(cart => cart.id === req.params.cid)
        ? res.send(carts.find(cart => cart.id === req.params.cid))
        : res.status(404).send({message:"no cart with the given id"})
    }else{
        res.status(404).send({message:"there's not cart created"})
    }
})


export default cartRouter