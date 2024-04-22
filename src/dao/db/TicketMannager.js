import ticketModel from "../models/ticket.model.js";

export default class TicketMannager{
    getTicket(code){
        return ticketModel.find({code})
    }
    async addTicket(info){
        try {
            const ticket = new ticketModel(info)
            await ticket.save()
            return ticket
        } catch (error) {
            return {
                error: error,
                status:500
            }
        }
    }
}