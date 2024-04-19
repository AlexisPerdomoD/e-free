
import fs from "fs"
import crypto from "crypto"
import { checkLocalDbFile as checkDb} from "../../utils/utils.js"
import envOptions from "../../config/dotenv.config.js"




 export default class ProductManager{
    
    constructor(path){
        this.path = path
    }
   async getProductsPaginate(querys){
        try {
            if(fs.existsSync(this.path))return {error:true, message:"not such directory", status:404}
            const {limit, page, sort, category} = querys
            const {products, payload} = await checkDb(this.path)
            const response = {products, payload, status:"success"}
            response.totalPages = 1
            response.nextPage = null
            response.prevPage = null
            response.hasPrevPage = false
            response.hasNextPage = false
            if(sort && sort === "1")response.products.sort((a, b) => a.price -b.price)
            if(sort && sort === "-1")response.products.sort((a, b) => b.price -a.price)
            if(!limit || limit > 100)limit = 100 //dont want anything broken 
            if(category){
                response.products = products.filter(p => p.category = category)
                response.payload = response.products.length
            }
            if(limit && limit < payload){
                response.totalPages = Number.isInteger(response.payload / limit) 
                ? response.payload / limit 
                : Math.floor(response.payload / limit) +1
                if(page && page -1 > 1){
                    response.products = response.products.slice((page-1)*limit-1, 
                    page * limit > products.length -1 
                    ? products.length -1 
                    : page * limit)
                }else{response.products = response.products.slice(0, limit-1)}

            }
            if(page && page > 1){
                response.hasPrevPage = true
                response.prevPage = envOptions.host + "/?page=" + parseInt(page) - 1
            }
            if(page && page < response.totalPages){
                response.hasNextPage = true
                response.nextPage = envOptions.host + "/?page=" + parseInt(page) + 1
            }

            if(category && response.prevPage)response.prevPage += `&20category=${category}&20`
            if(category && response.nextPage)response.nextPage += `&20category=${category}&20`
            if(limit && response.prevPage)response.prevPage += `&20limit=${limit}&20`
            if(limit && response.nextPage)response.nextPage += `&20limit=${limit}&20`
            return response
        } catch (error) {
            console.error(error)
            return {error:true, status:500}
        }
    }
    async addProduct({title, description, price, category, thumbnail, code, stock ,status = true}){
        try {
            const m = await checkDb(this.path)
        // VALIDACIONES
        if(m.products.find(p => p.code === code)){
            return {
                message:"code already used in the catalogo, please change it",
                error:true,
                status:400
            }
        }else{
            const id = crypto.randomBytes(16).toString("hex")
            const newProduct = {
                id, 
                title, 
                description, 
                price,
                category, 
                thumbnail, 
                code, 
                stock, 
                status
            }
            m.products.push(newProduct)
        // AGREGAR EL PRODUCTO
             await fs.promises.writeFile(this.path, JSON.stringify({products:m.products}))
             return {
                message:`product ${newProduct.code} correctly added`, 
                content:newProduct
            }
        }
        } catch (error) {
            console.log(error)
            return {error: error, status:500}
        }
    }
   async getProductById(id){
        try {
            const m =  await checkDb(this.path)
            const res = m.products.find(p => p.id.toString() === id)
            return res ? res : {error:true, status:404}
        } catch (error) {
            return {error:true, status:500}
        }
    }
    async updateProduct(id, updates){
       try {
        const m =  await checkDb(this.path)

        if(updates.code && m.products.find(product => product.code === updates.code))return {
            message:"this product can't be update, need to add an new code",
            status:400,
            error:true
        }
        if(m.products.find(p => p.id === id)){
            let index = m.products.findIndex(p => p.id === id)
            for (const key in updates) {
                if (key in m.products[index][key]){
                    m.products[index][key] = updates[key]
                }
            }
            await fs.promises.writeFile(this.path, JSON.stringify({
                products:m.products, 
                payload:m.products.length
            }))
            return {
                message:`  update at id : ${id} properly made`,
                content: pManager.products[index]
            }
        }else{
            return {message:`there's not product with the id: ${id}`,status:400, error:true}
        }
       } catch (error) {
           return {error:true, status:500}
       }
    }
    async deleteProductById(id){
       try {
            const m =  await checkDb(this.path)
            let product = m.products.find(p => p.id.toString() === id)
            if(product){
                m.products = m.products.filter(p => p.id.toString() !== product.id)
                await fs.promises.writeFile(this.path,JSON.stringify({
                    products:m.products,
                    payload: m.products.length
                }))
            return {message:"product deleted", content:product}
            }else{
            return {error:true, status:404, message:"not product found"}
        }
       } catch (error) {
        console.error(error)
        return {error:true, status:500}
       }
    }
}