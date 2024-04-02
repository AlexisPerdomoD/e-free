import cartModel from "../models/cart.model.js"
import ProductMannagerM from "./ProductMannagerM.js"
const pm = new ProductMannagerM()

export default class CartMannagerM{
    getCartById(id){
        try {
            return cartModel.findOne({_id: id})
        } catch (error) {
            return {
                message:"there was a problem looking for the cart with the id: "+ id,
                error: true,
                status:500
            }
        }
    }
    async deleteCartById(id){
        const response = await cartModel.findByIdAndDelete(id)
        try {
            return {
                message: response ? "cart eliminated properly" : "cart not found",
                status: response ? 200 : 404
            }
        } catch (error) {
            return {
                message:"there was a problem looking for the cart with the id: "+ id,
                status:500,
                error:error
            }
        }
    }
    async addCart(){
        try {
            let newCart =  new cartModel()
            newCart = await newCart.save()
            return {
                message:"cart properly added, id: "+ newCart._id,
                content: newCart}
        } catch (error) {
            return {
                message:`there was a problem creating the cart`,
                error: error,
                status:500
            }
        }
    }
    async deleteProductfromCart(cId, pId){
        try {
            const product = await pm.getProductById(pId)
            if (product.error) return product

            const cart = (await cartModel.find({_id:cId}))[0]
            if (cart === null) return {error:true, status:404, message:"not cart with the given id"}

            if (!cart.products.find(product => product.product.toString() === pId)) return {message:"not product with the given id", status:400, error:true}

            cart.products = cart.products.filter(product => product.product.toString() !== pId)
            const response = await cartModel.updateOne({_id: cId}, {$set: {products: cart.products}})
            return {
                message:"product properly deleted with the id "+ pId,
                content: response
            }
        } catch (error) {
            return {
                message:`there was a problem deleting the product in the cart with id: ${cId}`,
                error,
                status:500
            }
        }
    }
    async updateCartProduct(cId, pId, quantity = 1){
        try {
            const product = await pm.getProductById(pId)
            //return product error 
            if (product.error) return product

            const cart = (await cartModel.find({_id:cId}))[0]
            if (cart === null) return {error:true, status:404, message:"not cart with the given id"}

            const existingProduct = cart.products.find(item => item.product.toString() === pId)
            quantity = +quantity

            if (!existingProduct && quantity === 0) return  {
                message:`the product id:${pId} is not in the cart list`, 
                status:400,
                error:true
            }
            
            if (existingProduct){
                cart.products = quantity === 0 
                ? cart.products.filter(item => item.product.toString() !== pId)
                : existingProduct.quantity = quantity
            }else{
                let p =  await pm.getProductById(pId)
                cart.products.push({product: p.content._id, quantity})
            }
            const response = await cartModel.updateOne({_id: cId}, {$set: {products: cart.products}})
            return {
                message:"cart properly updated",
                content: response
            }
        } catch (error) {
            return {
                message:`there was a problem updating the cart id: ${cId}`,
                error: error,
                status:500
            }
        }
    }
}