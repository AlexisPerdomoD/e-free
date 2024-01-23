// view socket intance for client with socket io 
const socket = io()



// hear event just for this socket from server 
socket.on("private", data => {
    console.log(data.message)
})
// hear broadcast type events from server
socket.on("broadcast", data =>{
console.log(data)
})

// hear public events from server 
socket.on("productList", products =>{
    const productList = document.querySelector(".catalogo__list")
    productList.innerHTML = ""
    products.forEach(product =>{
        productList.innerHTML +=`
        <li>
            <div class="card" style="width: 200px;">
                <img src=${product.thumbnail} alt="image reference for ${product.title}" height="200" width="150">
                <h4>${product.title}</h4> 
                <p>${product.description}</p>
                <p>price: $${product.price}</p>
                <p>id for test: ${product.id}</p>
                <div class="card__button">
                    <button>something else</button>
                    <button class="add-card">add to card</button>
                </div>
            </div>
        </li>
        `
    })
})

const deleteForm = document.querySelector("#delete__product")
const addForm = document.querySelector("#add__product")

deleteForm.addEventListener("submit", (event)=>{
    event.preventDefault()
    const data = {
        id: document.getElementById("id-to-delete").value.toString()
    }
    socket.emit("delete", data)
})

addForm.addEventListener("submit", (event)=>{
    event.preventDefault()
    const data = new FormData(addForm)
    const product = {
        title: data.get("title"),
        "description": data.get("description"),
        price: data.get("price"),
        category: data.get("category"),
        thumbnail: data.get("thumbnail").split(" "),
        code: data.get("code"),
        stock: data.get("stock")
    }
    socket.emit("addProduct", product)
})