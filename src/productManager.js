import fs from "fs"


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
    
    constructor(){
        this.path = "./src/db.json",
        this.products = [],
        this.id =  0
    }
   async getProducts (){
        if(fs.existsSync(this.path)){
            const res = await checkDb(this.path)
            return res.products.lenght !== 0  ? res.products : "there's nothing in this directory"
        }else{
            return "not such directory"
        }
    }
    async addProduct(title, description, price, thumbnail, code, stock ){
        const pManager = await checkDb(this.path)
        // VALIDACIONES
         if(!title || !description || !price || !thumbnail || !code || !stock){
            console.error("---------------------in order to add a new file every field must be filled properly---------------------")

        }else if(this.products.find(p => p.code === code) || pManager.products.find(p => p.code === code)){
            console.error(`---------------------this code:${code} is already in class ProductManager---------------------`)
            
        }else{
        // VERIFICACIÓN DE ESTADO DE DB
            pManager.id > this.id  ? this.id = pManager.id : this.id 

            let id = this.id
            const newProduct = {id, title, description, price, thumbnail, code, stock }


            if(this.products.length < pManager.products.length){
                this.products = [];
                pManager.products.forEach((e) => this.products.push(e))

                this.products.push(newProduct)
            }else{
                this.products.push(newProduct)
            }
            this.id++
        // AGREGAR EL PRODUCTO
            fs.promises.writeFile(this.path, JSON.stringify({products:this.products, id:this.id})).then(res => {
            console.log(` ---------------------product ${newProduct.code} correctly added---------------------`)
            }).catch(err => console.error(err))
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
        if(pManager.products.find(p => p.id === id)){
            let index = pManager.products.findIndex(p => p.id === id);
            pManager.products.splice(index, 1)

           fs.promises.writeFile(this.path,JSON.stringify({
                products:pManager.products,
                id:pManager.id -1
                }))
                .then(res => {
                    return ` product: ${pManager.products[index].code} deleted  at id : ${id}`
                })
                .catch(err => {console.error(err)})
        }else{
            return undefined
        }


    }
}