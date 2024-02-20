import { Schema, model } from "mongoose"

const cartScheme = new Schema({
    products: [
        {
            _id:{
                type: Schema.Types.ObjectId, 
                ref: "products"
            },
            quantity: Number
        }  
    ]
})
// recordar usar populate para validar esa referencia y relacion con la colleccion products
const cartModel = model("carts", cartScheme)
export default cartModel