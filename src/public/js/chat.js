// view socket intance for client with socket io 
const renderMessages = (messages, node) =>{
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
        if(node.innerHTML === "") node.innerHTML = "<h2>no Message to show</h2>" 
    })
}
const chatList = document.querySelector(".chat__list")
const socket = io("/chat")
socket.on("messages", async update => renderMessages(update, chatList))

socket.on("private", data => {
    console.log(data.message)
    // testing propurses 
    data.content && console.log(data.content)
    data.error && console.log(data.error)
})

const chatForm = document.querySelector("#chat__form")
chatForm.addEventListener("submit", async event =>{
    event.preventDefault()
    try {
        const message = Object.fromEntries(new FormData(chatForm))
        socket.emit("send message", message)
        chatForm.message.value = ""
    } catch (error) {
        console.log(error)
    }
})