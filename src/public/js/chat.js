// view socket intance for client with socket io 
const renderMensages = (messages, node) =>{
    node.innerHTML = ""
    messages.forEach(message =>{
        node.innerHTML += `
        <li>
            <div class="message">
                <div>
                    <span>${message.usser}</span>
                    <p>${(new Date(message.date)).toISOString().split('T')[0]}</p>
                </div>    
                <p>${message.message}</p>
            </div>
        </li>`
    })
}
const chatList = document.querySelector(".chat__list")
const socket = io("/chat")
socket.on("connection", messages => renderMensages(messages, chatList))
socket.on("messages", messages => renderMensages(messages, chatList))
socket.on("private", data => {
    console.log(data.message)
    // testing propurses 
    data.content && console.log(data.content)
    data.error && console.log(data.error)
})


const chatForm = document.querySelector("#chat__form")
chatForm.addEventListener("submit", (event)=>{
    event.preventDefault()
    try {
        const message = new FormData(chatForm)
        socket.emit("send message", {
            usser: message.get("usser"),
            message: message.get("message")
        })
        chatForm.message.value = ""
    } catch (error) {
        console.log(error)
    }
})