import logger from '../../config/winston.config.js'
import { commentsM } from '../../dao/index.js'
import em from '../../utils/error.manager.js'
export default function chatSocketHandler(io) {
    const chatSH = io.of('/chat')
    chatSH.on('connection', async (socket) => {
        logger.http('new usser connected to chat id: ' + socket.id)
        //socket to hear add products requests
        socket.emit('connection', { message: 'welcome to our comment section' })
        socket.on('send message', async (message) => {
            try {
                let response = await commentsM.addDocument(message)
                if (!response.error) {
                    socket.emit('private', { message: 'your message was sent' })
                    chatSH.emit('messages', await commentsM.getColletion())
                } else {
                    socket.emit('private', response)
                }
            } catch (error) {
                logger.error(error.message || error.name || 'WebSocket Error')
                em.generateExternalServiceError('Socket.io')
            }
        })
    })
    return chatSH
}
