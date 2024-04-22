import mongoose, { Schema } from "mongoose";
import  crypto  from 'node:crypto';

const ticketSheme = new Schema({
    code:{
        type: String,
        default:crypto.randomBytes(16).toString('hex'),
        unique:true
    },
    purchase_datetime:{
        type: Date,
        default:Date.now(),
    },
    amount:{
        type:Number,
        min:[0,"not valid negative values"]
    },
    purchaser:String,
    products:{
        type:[
            {
                product_name:String,
                quantity: Number, 
                price: Number,
                product_amount:Number
            }
        ]
    }
})
const ticketModel = mongoose.model("tickets", ticketSheme)
export default ticketModel