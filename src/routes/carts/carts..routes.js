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
    const carts = fs.existsSync("./carts.json") 
    ? await fs.promises.readFile("./carts.json", "utf-8")
    : res.status(404).send({message:"there's not cart created"})

    console.dir(carts)
})


export default cartRouter