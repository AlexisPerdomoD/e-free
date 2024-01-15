
import fs from "fs"
import crypto from "crypto"


const checkDb = async(path) => {
    try {
        !fs.existsSync(path) && await fs.promises.writeFile(path, JSON.stringify({products:[], id:0}))

        const res = await fs.promises.readFile(path, "utf-8")
        // CHECKEAR ESTE TERNARIO APARENTEMENTE REDUNDANTE
        const jsonRes =  res ? JSON.parse(res) : {products:[], id:0}
        return jsonRes
        
    } catch (error) {
        console.error(error)
    }
}

 export default class ProductManager{
    
    constructor(path){
        this.path = path,
        this.products = []
    }
   async getProducts (){
        if(fs.existsSync(this.path)){
            const res = await checkDb(this.path)
            return res.products.lenght !== 0  ? res.products : "there's nothing in this directory"
        }else{
            return "not such directory"
        }
    }
    async addProduct(title, description, price, category, thumbnail, code, stock ,status = true ){
        const pManager = await checkDb(this.path)
        // VALIDACIONES
        if(this.products.find(p => p.code === code) || pManager.products.find(p => p.code === code)){
            
            throw new error(`this code:${code} is already in class ProductManager`)
            
        }else{

            let id = crypto.randomBytes(16).toString("hex")
            const newProduct = {id, title, description, price,category, thumbnail, code, stock, status}

            if(this.products.length < pManager.products.length){
                this.products = [];
                pManager.products.forEach((e) => this.products.push(e))

                this.products.push(newProduct)
            }else{
                this.products.push(newProduct)
            }
        // AGREGAR EL PRODUCTO
             await fs.promises.writeFile(this.path, JSON.stringify({products:this.products}))
             return {status :`product ${newProduct.code} correctly added`, id: newProduct.id}
        }
    }
   async getProductById(id){
        const pManager =  await checkDb(this.path)
    // BUSCAR POR ID
        let res = pManager.products.find(p => p.id === +id)
    // RESPUESTA
        return res ? res : undefined
    }

    async updateProduct(id, field, newValue){
        const pManager =  await checkDb(this.path)
    // VALIDACIONES
        if(!id && !field && !newValue){
            console.error("every field must be filled properly")
            return "missing fields error"
        }
        if(pManager.products.find(p => p.code === newValue)){
            console.error("this product is using an existing code, need a new one")
            return "product already added"
        }


        if(pManager.products.find(p => p.id === id)){
    // RESPUESTA
            let index = pManager.products.findIndex(p => p.id === id);
            pManager.products[index][field] = newValue

           
           fs.promises.writeFile(this.path, JSON.stringify({products:pManager.products, id:pManager.id})).then(res => {
            console.log(`field ${field} with value ${newValue}  updated properly at id : ${id}`)
        }).catch(err => {console.error(err)})

        }else{
        
            console.log(`----------------------------there's not product with the id: ${id}----------------------------`)
        }
    }
    async deleteProduct(id){
        const pManager =  await checkDb(this.path)
        let product = pManager.products.find(p => p.id === id)
        
        if(product){
            let index = pManager.products.findIndex(p => p.id === id);
            pManager.products.splice(index, 1)
            let res = await fs.promises.writeFile(this.path,JSON.stringify({
                products:pManager.products,
                id:pManager.id
                }))
        return product
        }else{
            return null
        }


    }
}