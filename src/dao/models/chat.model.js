import { Schema, model } from "mongoose";

const chatSheme = new Schema({
    message:String,
    usser: String,
    date:{
        type: Date,
        default: Date.now
    }
})

const chatModel =  model("chats", chatSheme)
export default chatModel