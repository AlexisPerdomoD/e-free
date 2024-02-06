import { Schema, model } from "mongoose"

const productScheme =  new Schema({
    title:{
        type: String,
        unique: true,
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
        enum:["sandwich","chicken","sides", "tortillas", "sea food", "beef", "desserts", "drinks"],
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
        default: true
    }
})

const productModel = model("products", productScheme)

export default productModel