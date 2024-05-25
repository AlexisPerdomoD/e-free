import { Schema, model } from "mongoose";

const chatSheme = new Schema({
    message:{
        trim: true,
        require: true,
        type: String
    },
    usser: {
        trim:true,
        require: true,
        type: String
    },
    date:{
        type: Date,
        default: Date.now
    }
})

const chatModel =  model("chats", chatSheme)
export default chatModel