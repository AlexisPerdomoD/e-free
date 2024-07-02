import usserModel from '../models/usser.model.js'
import em, { ErrorCode } from '../../utils/error.manager.js'
import { sendDeleteInnactiveUsserEmail } from '../../config/mailer.config.js'
export default class UsserMannagerM {
    async getUsserById(id) {
        const response = await usserModel.findById(id)

        if (response?.name === 'CastError')
            throw em.createError({
                name: response.name,
                message: response.message || 'no user found',
                status: 404,
                code: ErrorCode.INVALID_TYPE_ERROR
            })
        return response
    }
    async setUsser(usser) {
        let newUsser = new usserModel(usser)
        newUsser = await newUsser.save()
        if (newUsser.name === 'CastError')
            throw em.createError({
                name: newUsser.name,
                status: 400,
                message: newUsser.message || newUsser.errors || 'invalid inputs',
                code: ErrorCode.INVALID_TYPE_ERROR
            })
        return {
            message: 'usser properly added, id: ' + newUsser._id,
            content: newUsser
        }
    }
    async getUsser(ussername) {
        const response = await usserModel.findOne({ email: ussername })
        if (response === null)
            em.createError({
                status: 404,
                message: 'user not found',
                code: ErrorCode.GENERAL_USER_ERROR
            })
        return response
    }

    async updateUsser(ussername, updates) {
        const usser = await this.getUsser(ussername)
        const response = await usserModel.updateOne({ _id: usser._id }, { $set: updates })
        return response
    }
    async deleteUsser(ussername) {
        const usser = await this.getUsser(ussername)
        const response = await usserModel.deleteOne({ _id: usser._id })
        return response
    }
    async getUssers(options = {}) {
        options.select = '-password -__v -cart'
        return await usserModel.paginate({}, options)
    }
    async deleteInactiveUssers() {
        const oneMonthInMilliseconds = 1000  * 60 * 60 * 24 * 30
        const inactivityThreshold = new Date(Date.now() - oneMonthInMilliseconds)

        const inactiveUsers = await usserModel.find({ last_session: { $lt: inactivityThreshold } })
        if (inactiveUsers.length === 0)
            return {
                message: 'No inactive users found in the last month'
            }
        const promises = []
        for (const usser of inactiveUsers) {
            promises.push(
                // WRAPING THIS INTO AN ANONYMOUS FUNCTION AND PUSH IT INTO promises TO DO MULTITHREADING
                (async function () {
                    await usserModel.deleteOne({ _id: usser._id })
                    // CHECKS IF THE USSER HAS A VALID EMAIL  and SEND EMAIL
                    const EMAIL_REGEX = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/
                    EMAIL_REGEX.test(usser.email) && (await sendDeleteInnactiveUsserEmail(usser))
                    return 'inactive user deleted: ' + usser.email
                })()
            )
        }
        return await Promise.allSettled(promises)
    }
}
