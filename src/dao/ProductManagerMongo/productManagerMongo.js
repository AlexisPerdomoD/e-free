import productModel from "../models/product.model.js"

export default class ProductManagerMongo{
    constructor(collection){
        this.collection
    }
    async getProducts(){
        try {
            let response =  await productModel.find()
            return  response.map(product => {
                return {
                    title: product.title,
                    description: product.description,
                    price: product.price,
                    thumbnail:product.thumbnail,
                    _id: product['_id'],
                    stock: product.stock,
                    category: product.category
                }
            })
        } catch (error) {
            return {
                message:"there was a problem getting products from e-comerse-server",
                error: error 
            }
        }
    }
    async getProductById(id){
        try {
            return {
                message:"product found",
                content : await productModel.findById(id)
            }
        } catch (error) {
            return {
                message:"there was a problem looking for the product with the id: "+ id,
                error: error}
        }
    }
    async deleteProductById(id){
        try {
            return {
                message:"product eliminated properly",
                content :await productModel.findByIdAndDelete(id)
            }
        } catch (error) {
            return {
                message:"there was a problem looking for the product with the id: "+ id,
                error: error}
        }
    }
    async addProduct(product){
        try {
            let newProduct =  new productModel(product)
            newProduct = await newProduct.save()
            return {
                message:" product added properly",
                content: newProduct}
        } catch (error) {
            return {
                message:"there was a problem adding this product:" + product.name,
                error: error 
            }
        }
    }
    async updateProduct(id, updates){
        try {
            let response = await productModel.updateOne({_id: id}, {$set: updates})
            return {
                message:"product properly update",
                content: response
            }
        } catch (error) {
            return {
                message:"there was a problem updating this product: " + id,
                error: error 
            }
        }
    }
}