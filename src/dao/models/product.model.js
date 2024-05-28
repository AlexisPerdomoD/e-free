import { Schema, model } from "mongoose"
import  mongoosePaginate  from "mongoose-paginate-v2"

const productScheme =  new Schema({
    title:{
        type: String,
        require: true,
        trim: true,
    },
    description:{
        type: String,
        require: true,
        trim: true,
    },
    price:{
        type: Number,
        require: true,
        min:[0,"price must be higher than 0"]
    },
    category:{
        type: String,
        require: true
    },
    code: {
        type: String,
        require: true,
        unique: true,
        maxLength: 16
    },
    thumbnail:{
        type:String,
        default: "https://upload.wikimedia.org/wikipedia/commons/e/ea/No_image_preview.png"
    },
    status:{
        type: Boolean,
        default: false
    },
    stock:{
        type:Number,
        default:0,
        min:[0, "stock invalid"]
    },
    owner:String
})
productScheme.plugin(mongoosePaginate)
const productModel = model("products", productScheme)
export default productModel
