import usserModel from "../models/usser.model.js"

export default class UsserMannagerM{
    async getUsserById(id){
        try {
            return await usserModel.findById(id)
        } catch (error) {
            if(error.name === "CastError") return {error, status:404}
            return {error, status:500}
        }
    } 
    async setUsser(usser){
        try {
            let newUsser =  new usserModel(usser)
            newUsser = await newUsser.save()
            return {
                message: "usser properly added, id: " + newUsser._id,
                content: newUsser
            }
        } catch (error) {
            if(error.name === "CastError") return {error, status:400}
            return {error, status:500}
        }
    }
    async getUsser(ussername){
        const response = await usserModel.findOne({email:ussername})
            if(response === null) return null
            if(!response) throw new Error({status:500})
            return response
    }


//     async updateUsser(uid, updates){
//         const usser = await this.getUsserById(uid)
//         if(usser === null) return {error:"not usser found", status:401}
//working
//     }
}
