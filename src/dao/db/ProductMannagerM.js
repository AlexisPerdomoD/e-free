import productModel from "../models/product.model.js"


export default class ProductMannagerM{

    async getProductsPaginate(querys){
        try {
            const options = {limit: 10, page: 1}
            if(querys.limit) {
                options.limit = +querys.limit
                delete querys.limit
            }
            if(querys.page) {
                options.page = +querys.page
                delete querys.page
            }
            if(querys.sort){
                let sort = querys.sort 
                let toOrder = querys.to ? querys.to : "price"
                delete querys.to
                delete querys.sort 
                options.sort = {}
                options.sort[toOrder] = +sort || sort
            }
            
            let data = await productModel.paginate(querys, options)
            const response = {status: "success"}
            response.payload = data.totalDocs
            response.totalPages = data.totalPages
            response.page = data.page,
            response.hasPrevPage = data.hasPrevPage
            response.hasNextPage = data.hasNextPage
            response.nextPage = data.nextPage
            response.prevPage = data.prevPage
            response.products = data.docs
            return response
            
        } catch (error) {
            console.log(error)
            return {error, status:500}
        }
    }

    async getProductById(id){
        try {
            return {
                message:"product found",
                content : await productModel.findById(id)
            }
        } catch (error) {
            if(error.name === "CastError") return {error, status:404}
            return {error, status:500}
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
            if(error.name === "CastError") return {error, status:404}
            return {error, status:500}
        }
    }
    async addProduct(product){
        try {
            let newProduct =  new productModel(product)
            newProduct = await newProduct.save()
            return {
                message: "product properly added, id: " + newProduct._id,
                content: newProduct
            }
        } catch (error) {
            console.log(error)
            if(error.name === "CastError") return {error, status:400}
            return {error: error, status:500}
        }
    }
    async updateProduct(id, updates){
        try {
            let response = await productModel.updateOne({_id: id}, {$set: updates})
            return {
                message:"product properly updated",
                content: response
            }
        } catch (error) {
            if(error.name === "CastError") return {error, status:404}
            return {error: error, status:500}
        }
    }
}