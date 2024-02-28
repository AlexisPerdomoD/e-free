const URL = "http://localhost:8080/api/cart/"

async function getCart(){
    let cartId = localStorage.getItem("card_id")
    if(!cartId){
        let response = await fetch(URL, {method:"POST"})
        if(!response.ok) throw new Error(response.statusText)
        response = await response.json()
        localStorage.setItem("card_id", response.content._id)
        return response.content
    }
    let response =  await fetch(URL + cartId)
    if(!response.ok) throw new Error(response.statusText)
    response = await response.json()
    return response.content
}

async function addProduct(pId, quantity = 1){
     // in the future ill be a initiate session 
     const cart = await getCart()

     const options = { 
        headers:{
            "Content-Type": "application/json"
        },
        method:"PUT",
        body: JSON.stringify({quantity: +quantity})
     }
     let response = await fetch(URL + cart._id + "/product/" + pId, options)
     if(!response.ok) throw new Error(response.statusText)
     response = await response.json()

     //luego incluir en otra funcion
     const cartLink = document.querySelector("#cart__link")
     cartLink.children[0].href = URL + cart._id + "/show"
     cartLink.children[1].innerHTML = `<span>${cart.products.length} products added</span>`
}
