import  expressHandlerBars  from 'express-handlebars';
const eH = expressHandlerBars.create({    
    helpers:{
        checkList: (list, options) => {
            if(list.length < 1) return "<li>nothing to show yet</li>" 
            let out = ""
            list.forEach(li =>{
                out +=`
                <li>
                    ${options.fn(li)}
                </li>` 
            })
            return out
        },
        printCartItem: item =>{
            let result = `
            <span> ${item.product.title} </span>
            <span>unit price $ ${item.product.price} * quantity ${item.quantity} = $ ${item.product.price * item.quantity}</span>
            `
            return new eH.handlebars.SafeString(result)
        }, 
        printProduct: product =>{
            let result =` 
            <div class="card">
                <img src=${product.thumbnail} alt="image reference for ${product.title}" height="200" width="150">
                <div class="card__content">
                    <h4>${product.title}</h4> 
                    <p>${product.description}</p>
                </div>
                <p class="prices">price: $${product.price}</p>
                <p id="test">id for test: ${product["_id"]}</p>
                <div class="card__button">
                    <button class="button" onclick={addProduct("${product["_id"]}", "0")}>delete</button>
                    <button class="add-card button" onclick={addProduct("${product["_id"]}")}>add to card</button>
                </div>  
            </div>`
            return new eH.handlebars.SafeString(result)
        },
        printMessage: message =>{
            let result = `
                <div class="message">
                    <div>
                        <span>${message.usser}</span>
                        <p>${(new Date(message.date)).toISOString().split('T')[0]}</p>
                    </div>    
                    <p>${message.message}</p>
                </div>`
            return new eH.handlebars.SafeString(result)
        }

    }
})
export default eH