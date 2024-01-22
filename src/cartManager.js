import fs from "fs"
import crypto from "crypto"

export default class CartManager{

    constructor(path){
        this.path = path
    }

    async getCarts(){
        !fs.existsSync(this.path) && await fs.promises.writeFile(this.path, JSON.stringify([]))

        return JSON.parse(await fs.promises.readFile(this.path, "utf-8"))
    }

    async addCart(cartProducts){
        const cart = {
            id: crypto.randomBytes(16).toString("hex"),
            products: [] 
        }
        cartProducts 
        && cartProducts.forEach(product => cart.products.push(product))

        const carts = await this.getCarts()
        carts.push(cart)
        await fs.promises.writeFile(this.path, JSON.stringify(carts))
        return cart
    }

    async getCart(cid){
        return (await this.getCarts()).find(cart => cart.id === cid)
    }
    async updateCart(cid, product){
        const carts = await this.getCarts()
        const index = carts.findIndex(cart => cart.id === cid)

        if(carts[index].products.find(p => p.id === product.id)){

            carts[index].products.forEach(p => {
                p.id === product.id && p.quantity++
            })

            await fs.promises.writeFile(this.path, JSON.stringify(carts))
            return carts[index]
        }else{
            carts[index].products.push({
                id:product.id,
                quantity: 1
            })

            await fs.promises.writeFile(this.path, JSON.stringify(carts))
            return carts[index]
        }
    }
    async deleteCart(cid){ 
        const cart = await this.getCart(cid)
        if(cart){
            let carts = await this.getCarts()
            carts = carts.filter(crt => crt.id !== cart.id)
            await fs.promises.writeFile(this.path, JSON.stringify(carts))
            return cart
        }else{
            return null
        }
    }
}