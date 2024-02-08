import { Schema, model } from "mongoose"

const cartScheme = new Schema({
    products: Array
})

const cartModel = model("carts", cartScheme)
export default cartModel