const URL = "http://localhost:3000/api/cart/"
const lINK__URL = "http://localhost:3000/cart/"

async function checkCartDom(){
    const cart = await getCart()
    if(cart.products.length > 0){
        const cartLink = document.querySelector("#cart__link")
        cartLink.children[0].href = lINK__URL 
        cartLink.children[1].innerHTML = `<span>${cart.products.map(e => e.quantity).reduce((acum, current) => acum + current, 0)}</span>`
        cartLink.children[1].style.display = "inline"
        cartLink.children[1].style.marginLeft = "10px"
        cartLink.children[1].style.position = "initial"
    }
}
async function getCart(){
    let response =  await fetch(URL)
    if(!response.ok) throw new Error(response.statusText)
    response = await response.json()
    return response
}

async function addProduct(pId, quantity = 1){
     const options = { 
        headers:{
            "Content-Type": "application/json"
        },
        method:"PUT",
        body: JSON.stringify({quantity: +quantity})
     }
     console.log(options)
     let response = await fetch(URL + "product/" + pId, options)
     if(!response.ok) throw new Error(response.statusText)
     checkCartDom()
}
const deleteProduct = (pId) => addProduct(pId, 0)
checkCartDom()