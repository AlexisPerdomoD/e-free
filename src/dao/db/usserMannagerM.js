import usserModel from "../models/usser.model.js"

export default class UsserMannagerM{
    async getUsserById(id){
        try {
            return {
                message:"usser found",
                content : await usserModel.findById(id)
            }
        } catch (error) {
            return {error, status:400}
        }
    } 
    async setUser(usser){
        try {
            let newUsser =  new usserModel(usser)
            newUsser = await newUsser.save()
            return {
                message: "usser properly added, id: " + newUsser._id,
                content: newUsser
            }
        } catch (error) {
            return {error, status:400}
        }
    }
    async getUsser(ussername){
        try {
            const response = await usserModel.findOne({email:ussername})
            if(response === null) throw new Error({status:404})
            if(!response) throw new Error({status:500})
            return response
        } catch (error) {
            return {error : true, status:error.status}
        }
    }
}