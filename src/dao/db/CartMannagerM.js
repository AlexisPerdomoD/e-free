import { Schema } from "mongoose"
import cartModel from "../models/cart.model.js"
import ProductMannagerM from "./ProductMannagerM.js"

export default class CartMannagerM{
    async getCarts(){
        try {
            let response =  await cartModel.find()
            return  response
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
                status: error}
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
    async addCart(){
        try {
            let newCart =  new cartModel({products:[]})
            newCart = await newCart.save()
            console.log(newCart)
            return {
                message:"cart properly added, id: "+ newCart._id,
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
            const cart = (await cartModel.find({_id:cId}))[0]
            if(cart.error) throw new Error(cart.error.message)
            if(!cart.products.find(product => product.product.toString() === pId)) throw new Error("there was no product with the given id")
            console.log("aquui?")
            
            cart.products = cart.products.filter(product => product.product.toString() !== pId)
            let response = await cartModel.updateOne({_id:cId}, {$set: {products: cart.products}})
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
        + quantity
        const pm = new ProductMannagerM()
        const product = await pm.getProductById(pId)

        if(product.error)return {message:"there was a problem to find the product", error: product.error}
        try {
            const cart = (await cartModel.find({_id:cId}))[0]
            console.log(cart)
            const oldProduct = cart.products.find(product => product.product.toString() === pId)

            if(oldProduct){
                
                cart.products = quantity < 1 
                ? cart.products.filter(product => product.product.toString() !== pId)
                : cart.products.map(product => {
                    if(product.product.toString() === pId) product.quantity = quantity
                    return product
                })
            }else{
                let p =  await pm.getProductById(pId)
                cart.products.push({"product": p.content._id, "quantity": quantity})
            } 
            
            let response = await cartModel.updateOne({_id: cId}, {$set: {products: cart.products}})
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