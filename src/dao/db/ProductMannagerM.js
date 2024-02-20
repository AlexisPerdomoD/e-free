import productModel from "../models/product.model.js"

export default class ProductMannagerM{
    async getProducts(){
        try {
            let response =  await productModel.find()
            return  response.map(item => {
                let res = {}
                for (const key in item) {
                    res[key] = item[key]
                }
                return res
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
                error: error
            }
        }
    }
    async deleteProductById(id){
        const response = await productModel.findByIdAndDelete(id)
        try {
            return {
                message:"product " + (response ? " eliminated properly" : " not found"),
                content : response
            }
        } catch (error) {
            return {
                message:"there was a problem looking for the product with the id: "+ id,
                error: error
            }
        }
    }
    async addProduct(product){
        try {
            let newProduct =  new productModel(product)
            newProduct = await newProduct.save()
            return {
                message: "product properly added, id: " + newProduct.id,
                content: newProduct
            }
        } catch (error) {
            return {
                message:`there was a problem adding the product`,
                error: error 
            }
        }
    }
    async updateDocument(id, updates){
        try {
            let response = await productModel.updateOne({_id: id}, {$set: updates})
            return {
                message:"product properly updated",
                content: response
            }
        } catch (error) {
            return {
                message:`there was a problem updating the product id: ${id}`,
                error: error 
            }
        }
    }
}