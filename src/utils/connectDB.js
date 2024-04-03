import mongoose from "mongoose";

export default async function connectDB(collection) {
    try {
        const response = await mongoose.connect("mongodb+srv://sixela__develop:n3HVKf1n4SAFH7MP@clutster0.xg9qfiw.mongodb.net/e-comerse-server" )
        console.log("mongodb clucher "+ collection + " connected properly")
        return response
    } catch (error) { 
        console.error("problem connecting to mongo db:" + collection + error)
    }
}