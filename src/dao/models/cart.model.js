import mongoose from "mongoose"


const cartScheme = new mongoose.Schema({
    date:{
        type:String
    },
    products: {
        type:[
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity:{
                    type: Number,
                    required: true
                }
            }
        ]
    }
})
cartScheme.pre("findOne", function(){ 
    this.populate("products.product")
})
// recordar usar populate para validar esa referencia y relacion con la colleccion products
const cartModel = mongoose.model("carts", cartScheme)
export default cartModel


// ref
// const CartSchema = new mongoose.Schema({
//     date: {
//       type: String,
//       required: true
//     },
//     products: {
//       type: [
//         {
//           product: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Product"
//           }
//         }
//       ]
//     }
//   });
  