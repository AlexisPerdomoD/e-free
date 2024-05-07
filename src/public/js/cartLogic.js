//const URL = dotenvConfig.host + "/api/cart"
//const lINK__URL = dotenvConfig.host + "/cart"
 async function checkCartDom(URL){
    const cart = await getCart(URL)
    console.log(cart)
    if (cart.products.length > 0) {
        const cartLink = document.querySelector("#cart__link")
        cartLink.children[0].href = URL + "/cart"
        cartLink.children[1].innerHTML = `<span>${cart.products
            .map((e) => e.quantity)
            .reduce((acum, current) => acum + current, 0)}</span>`
        cartLink.children[1].style.display = "inline"
        cartLink.children[1].style.marginLeft = "10px"
        cartLink.children[1].style.position = "initial"
    }
}
async function getCart(URL) {
    let response = await fetch(URL + "/api/cart")
    if (!response.ok) throw new Error(response.statusText)
    response = await response.json()
    return response
}

async function addProduct(pId, quantity = 1) {
    const options = {
        headers: {
            "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({ quantity: +quantity }),
    }
    let response = await fetch(window.host2 + "/api/cart/product/" + pId, options)
    console.log(response)
    if (!response.ok) throw new Error(response.statusText)
    checkCartDom(window.host2)
}
const deleteProduct = (pId) => addProduct(pId, 0)
checkCartDom(window.host2)
console.log(window)

