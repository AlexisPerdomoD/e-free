import usserModel from "../models/usser.model.js"
import em, {ErrorCode} from "../../utils/error.manager.js"
export default class UsserMannagerM{
    async getUsserById(id){
       const response = await usserModel.findById(id)
        
        if(response.name === "CastError")throw em.createError({
            name:response.name,
            message:response.message || "no user found",
            status:404,                
            code:ErrorCode.INVALID_TYPE_ERROR
        }) 
        return response
    } 
    async setUsser(usser){
       let newUsser =  new usserModel(usser)
       newUsser = await newUsser.save()
       if(newUsser.name === "CastError")throw em.createError({
           name:newUsser.name,
           status:400,
           message:newUsser.message || 'invalid inputs',
           code: ErrorCode.INVALID_TYPE_ERROR
       }) 
       return {
           message: "usser properly added, id: " + newUsser._id,
           content: newUsser
       }
    }
    async getUsser(ussername){
        const response = await usserModel.findOne({email:ussername})
            if(response === null) return null
            if(!response) throw new Error({status:500, code:ErrorCode.DATABASE_ERROR})
            return response
    }


//     async updateUsser(uid, updates){
//         const usser = await this.getUsserById(uid)
//         if(usser === null) return {error:"not usser found", status:401}
//working
//     }
}
