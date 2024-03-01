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
                    <button class="button" onclick={deleteProduct("${product._id}")}>delete</button>
                    <button class="add-card button" onclick={addProduct("${product._id}")}>add to card</button>
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
        },
        printNavigate: info =>{
            let next = info.hasNextPage ? info.nextPage : info.page
            let previus = info.hasPrevPage ? info.prevPage : info.page

            const setUrl = (querys, page) =>{
                querys.page = querys.page ? querys.page : 1
                let path = "?"
                for(const query in  querys){
                    if(query === "page") querys[query] = page 
                    path += `&&${query}=${querys[query]}`
                }
                return path
            }

            let nav = `
            <nav>
                <a href =${info.url + setUrl(info.querys, previus)} >back</a> 
                <span> current page:${info.page} of ${info.totalPages}</span> 
                <a href = ${info.url + setUrl(info.querys, next)} >next</a> 
            </nav>`

            return new eH.handlebars.SafeString(nav)
        }
    }
})
export default eH