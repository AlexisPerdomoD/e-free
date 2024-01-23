
import fs from "fs"
import crypto from "crypto"


const checkDb = async(path) => {
    try {
        !fs.existsSync(path) && await fs.promises.writeFile(path, JSON.stringify({products:[]}))

        const res = await fs.promises.readFile(path, "utf-8")
        // CHECKEAR ESTE TERNARIO APARENTEMENTE REDUNDANTE
        const jsonRes =  res ? JSON.parse(res) : {products:[]}
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

            throw new error(`this code:${code} is already in products`)
            
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
        let res = pManager.products.find(p => p.id.toString() === id)
    // RESPUESTA
        return res ? res : undefined
    }

    async updateProduct(id, updates){
        const pManager =  await checkDb(this.path)
        // VALIDACIONES
        if(updates.code && pManager.products.find(product => product.code === updates.code))return {
            message:"this code can't be update, need to add an new code",
            status:"error"
        }
        if(pManager.products.find(p => p.id === id)){
        // RESPUESTA
            let index = pManager.products.findIndex(p => p.id === id)
            for (const key in updates) {
                pManager.products[index][key] = updates[key]
            }

           
        await fs.promises.writeFile(this.path, JSON.stringify({products:pManager.products, id:pManager.id}))
        
        return {
            message:`  update at id : ${id} properly made`,
            pUpdated: pManager.products[index]
        }

        }else{
            return {message:`there's not product with the id: ${id}`,status:"error"}
        }
    }
    async deleteProduct(id){
        const pManager =  await checkDb(this.path)
        let product = pManager.products.find(p => p.id.toString() === id)
        
        if(product){
            let index = pManager.products.findIndex(p => p.id.toString() === id);
            pManager.products.splice(index, 1)
             await fs.promises.writeFile(this.path,JSON.stringify({
                products:pManager.products,
                id:pManager.id
                }))
        return product
        }else{
            return null
        }


    }
}