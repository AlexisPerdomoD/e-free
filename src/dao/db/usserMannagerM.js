import usserModel from "../models/usser.model"

export default class UsserMannagerM{
    async getUsser(id){
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
            newUsser = await usserModel.save()
            return {
                message: "usser properly added, id: " + newUsser._id,
                content: newUsser
            }
        } catch (error) {
            return {error, status:400}
        }
    }
}