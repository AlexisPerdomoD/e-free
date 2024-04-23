import cartModel from "../models/cart.model.js"
import ProductMannagerM from "./ProductMannagerM.js"
import TicketMannager from "./TicketMannager.js"
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
    async cartCheckOut(cId){
        try {
            let cart = (await cartModel.find({_id:cId}))[0]
            if(cart.products.length <= 0)return {status:400, error:true, message:"the cart does not have any product yet"}

            const ticketInfo = {
                amount:0,
                products:[]
            }

            for (const p of cart.products) {
                cart = (await cartModel.find({_id:cId}))[0]
                let product = await pm.getProductById(p.product)
                if(product.status === 404) throw new Error({error:true, message:"there was a product id in this cart that is not in the database"})
                product = product.content
                
                if(product.stock >= p.quantity){
                    ticketInfo.amount += p.quantity * product.price

                    ticketInfo.products.push({
                        product_name: product.title,
                        quantity : p.quantity,
                        product_amount: p.quantity * product.price,
                        price: product.price
                    })

                    await pm.updateProduct(product._id, {stock:product.stock -p.quantity})

                    const newProducts = cart.products.filter(pr => pr.product.toString() !== product._id.toString())
                    await cartModel.findByIdAndUpdate(
                        cId,
                        {products:newProducts},
                        {new:true}
                    )
                }
            }

            if(ticketInfo.products.length <= 0)return{ticket:null, message:"there is not stock for any of your products right now"}

            const tm = new TicketMannager()
            const ticket = await tm.addTicket(ticketInfo)
            cart = (await cartModel.find({_id:cId}))[0]
            return {
                message: cart.products.length > 0 ? "there were some missing stock for some of your products, they are still on the cart for the future" : "all products were properly included in your order",
                ticket
            }
        } catch (error) {
            return {
                message:`there was a problem checking out the cart id: ${cId}`,
                error: error,
                status:500
            }
        }
    }
}