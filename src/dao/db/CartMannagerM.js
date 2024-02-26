import cartModel from "../models/cart.model.js"
import ProductMannagerM from "./ProductMannagerM.js"

export default class CartMannagerM{
    async getCarts(){
        try {
            let response =  await cartModel.find()
            return  response.map(cart => {
                let res = {}
                for (const key in cart) {
                    res[key] = cart[key]
                }
                return res
            })
        } catch (error) {
            return {
                message:"there was a problem getting carts collection from e-comerse-server",
                error: error 
            }
        }
    }
    async getCartById(id){
        try {
            return {
                message: "cart found",
                content : await cartModel.findOne({_id:id})
            }
        } catch (error) {
            return {
                message:"there was a problem looking for the cart with the id: "+ id,
                error: error}
        }
    }
    async deleteCartById(id){
        const response = await cartModel.findByIdAndDelete(id)
        try {
            return {
                message:response ? "cart eliminated properly" : "cart not found",
                content : response
            }
        } catch (error) {
            return {
                message:"there was a problem looking for the cart with the id: "+ id,
                error: error}
        }
    }
    async addCart(productList){
        try {
            let newCart =  new cartModel({products: productList || []})
            newCart = await newCart.save()
            return {
                message:"cart properly added, id: "+ newCart.id,
                content: newCart}
        } catch (error) {
            return {
                message:`there was a problem creating the cart`,
                error: error 
            }
        }
    }
    async deleteProductfromCart(cId, pId){
        try {
            const cart = await this.getCartById(cId)
            if(cart.error) throw new error("there was no cart with the given id")

            cart.content.products = cart.content.products.filter(product => product._id !== pId)
            let response = await cartModel.updateOne({_id:cId}, {$set: {products: cart.content.products}})
            return {
                message:"product properly deleted with the id "+ pId,
                content: response
            }
        } catch (error) {
            return {
                message:`there was a problem deleting the product in the cart with id: ${cId}`,
                error: error 
            }
        }
    }
    async updateCartProduct(cId, pId, quantity = 1){
        const pm = new ProductMannagerM()
        const product0 = await pm.getProductById(pId)
        if(product0.error)return {message:"there was a problem to find the product", error: product0.error}
        try {
            const cart = await this.getCartById(cId)
            const product = cart.content.products.find(product => product._id.toString() === pId)
            if(product){
                product.quantity += quantity
                if(product.quantity < 1){   
                    cart.content.products = cart.content.products.filter(product => product._id.toString() !== pId)
                }
            }else{
                cart.content.products.push({_id:pId, quantity: quantity > 0 ? quantity : 1})
            } 
            
            let response = await cartModel.updateOne({_id: cId}, {$set: {products: cart.content.products}})
            return {
                message:"cart properly updated",
                content: response
            }
        } catch (error) {
            return {
                message:`there was a problem updating the cart id: ${cId}`,
                error: error 
            }
        }
    }
}