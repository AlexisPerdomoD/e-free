import mongoose from "mongoose";

export default async function connectDB(collection) {
    try {
        const response = await mongoose.connect(collection)
        console.log("data base connected properly")
        return response
    } catch (error) { 
        console.error("problem connecting to data base" + error?.message || "")
    }
}