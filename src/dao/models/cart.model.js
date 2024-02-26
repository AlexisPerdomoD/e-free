import { Schema, model } from "mongoose"

const cartScheme = new Schema({
    products: [
        {
            product:{
                type: Schema.Types.ObjectId, 
                ref: "products",
                require: true
            },
            quantity: Number
        }  
    ]
})
cartScheme.pre("findOne", function(){ 
    this.populate("products.product")
})
// recordar usar populate para validar esa referencia y relacion con la colleccion products
const cartModel = model("carts", cartScheme)
export default cartModel