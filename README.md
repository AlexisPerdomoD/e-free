

# E-Free 

This App is pretended to be a complete option to start with by needing and API REST Server for any kind of e-commeree.

the idea of this project is to connect or create your mongodb with your products and users and you'll be ready to use the endpoints of this.

> this proyect is considered totally open source, any contribution through pull request or comments that helps to keep increasing features are more than welcome!

##
<div align="center">
  <img src="https://www.maketecheasier.com/assets/uploads/2013/05/Free-Open-Source-Icon.png" alt="logo"  />
</div>

## Content
1) [Feactures](#feactures)
2) [Tecnologies](#tecnologies) 
3) [Requirements](#requirements)
4) [Setup](#setup)
5) [Endpoints](#endpoints)
6) [View Endpoints](#view-endpoints)
7) [Authentication](#authentication)
8) [Contributions](#contribution)
9) [How to reach me](#links)





## Features

- Complete API REST Ready to go with not need of much to run.
- E-free implement three-tier architecture, making use of views, bussiness logic and access data layers well separeted for good practices.

- E-free Api is able to handle CRUD operations over an any size products calalogo with query params, pagination, order, find by id and others.

- All responses are given with the Json format.

- Two deferent ways to run the Api, production and development, development mode include more debug information, Dao configuration for use local persistence instead of mongo and others development features.

- E-free Api handle cart endpoins for each user, keeping important information about what the user adds or removes from their shopping carts.

- E-free Api serves an enpoint with Websockets Protocol for live comments or status that requires live synchronitation betweend client and server. 

- E-free Api serves server render views' endpoints to have a visual way of some of the most important features works. 

- E-free offers not just an strong but flexible authentication  system, making use of passpost library to handle diferent strategies of session validations.

- Diferent level of session, regular session for users or costumers and protected endpoints only meant to be consume by admin accounts (mostly about some delicate CRUD operation about the products and the catalogo itself)

> This app is already deployed so you can test views or documentation endpoints at [Deploy](https://e-free.onrender.com)


## Tecnologies
This Aplication is builded using Javascript in Node js work enviroment with Express as Framework, more detail information about libraries and dependencies used can be checked in the package.json file.

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height="30" alt="javascript logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" height="30" alt="html5 logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" height="30" alt="css3 logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" height="30" alt="express logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/handlebars/handlebars-original.svg" height="30" alt="handlebars logo"  />
  <img width="12" />
  <img src="https://cdn.simpleicons.org/nodedotjs/339933" height="30" alt="nodejs logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" height="30" alt="mongodb logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg" height="30" alt="socketio logo"  />
</div>

###
## Requirements
E-free requires Node install in your work enviroment and at least a MongoDB connection able to be use. Don't worry about the collections, the api would create them with as soon it have access to de connection url.

#### Environment Variables

To run this project, you will need to add the following environment variables to your .env.production or .env.develoment file in the src directory.

*  `PORT` reference to the por where the api is running.

*   `DB` e-free uses mongose to connect with mongodb so DB is the url connection provided by your mongo database provider, more details of the connection can be found in the connectionDB.js file in the utils directory and here is [more information about mongose conection config](https://mongoosejs.com/docs/api/connection.html)

* `SECRET` used for sign cookies and sessions so be careful about it

* `HOST` reference the host where the app is running

* `PERSISTENCE` includes 'FS'(file system) making use of a json file 'products.json' next to 'ProductMannager.js' file in the productMannager directory inside DAO directory. if you want to make use of this file for including your own products you can do it. The other option for PERSISTENCE is 'MONGO' that will connect with MONGODB with a diferent productMannager.

*  `MODE` there is 'DEV'(development) with more debug information, persistence mode in file system for products(JSon file) and 'PRO'(production) with persistence mode in mongodb for everything. This is for debug information purposes. 

* `ADMIN` in order to create an user with admin purpuses, the email must be placed in the .env and then, with the app running create the user with the same email. After that, this user's session will be able to get to admin endpoints.
* `MAILER`
- `MAILER_USER` the email of the user that will be used to send mails
- `MAILER_PASS` the password of the user that will be used to send mails
- `MAILER_SERVICE` the service that will be used to send mails, in this case 'gmail'
- `MAILER_PORT` the port that will be used to send mails, in this case '587'

#### example .dev.develoment
```
PORT = 8080
// connection string template provide by mongo atlas
DB = mongodb+srv://username:***********@clutster0.*******.mongodb.net/e-comerse-server
SECRET = secret
HOST = http://localhost:8080
PERSISTENCE = MONGO
MODE = PRO
ADMIN = 'admin@example.com'
# MAILER
ADMIN = 'admin@mail.com'
MAILER_USER=mailer4project@gmail.com
MAILER_PASS=Secr3d123*
MAILER_SERVICE=gmail
MAILER_PORT=587
```
## Setup 

After cloning this repo and with all enviroment variables defined all we need to do is to start the app by running the following commands: 

```
npm install 
```
install dependencies.
```
npm run dev 
```
to run the project using src/.env.development using nodemon.
```
npm start
```
to run the project using src/.env.production. 

## Endpoints

### Swagger documentation
Before hands on, you will have access for an specifict documentation enpoint built with [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc).
there you'll find more details about the endpoint and how it works.

```http
GET /api/apidocs
```

### Users

### Get all users

``` http
GET  /api/users
```

By default this endpoint is not protected but is meant for admin purposes.

### Signup

``` http
POST  /api/user/
```
requires a body with the information in json that follows the user model: 
```
{
  'first_name':'testino',
  'last_name':'Gutierrrez',
  'email':'example@valid.com',
  'password':'Secr3t0*'
}
```
the email must by unique and by default the regex for the password is the following:
```js
const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; 
```
> more details check passport config in the config directory.

Response example

```json
{
  "ok": true,
  "message": "session properly started and user created"
}
```

### login

```http
POST /api/usser/login
```

requires a body with the information in json that follows the user model: 
```
{
  'email':'example@valid.com',
  'password':'Secr3t0*'
}
```
> session by default last around 1h, you can see more details in session config.

Response example 
```json 
{
  "ok": true,
  "message": "session properly started"
}
```
### logout

```http
GET /api/usser/logout
```
Response example
```json 
{
  "ok": true,
  "message": "logged out"
}
```



## Products

### Catalog

```http
GET /api/products
```
> this route is not protected by default.

example 
```
{
  "status": "success",
  "payload": 22,
  "products": [
    {
      "_id": "65c061c7e7934b434e25b6ca",
      "title": "Crispy Chicken Tenders",
      "description": "Golden-fried chicken tenders served with your choice of dipping sauce – BBQ, honey mustard, or ranch",
      "price": 7.49,
      "category": "chicken",
      "status": true,
      "thumbnail": "https://images.unsplash.com/photo-1627662168781-4345690f0bb3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "code": "CHKTND002",
      "stock": 99
    },
    ...
  ]
  totalPages": 3,
  "page": 1,
  "hasPrevPage": false,
  "hasNextPage": true,
  "nextPage": 2,
  "prevPage": null
}
```

#### Query Params:
`limit`: references the number of products for each page. Default 10.

`page`: references the number of  the page, default 1. 

`category`: filter products by field category. 

`sort`: references de order by price, 1 for asc -1 for desc order. Default 1. 

example 

```http
GET /api/products/?category=sides&limit=2&sort=-1&page=2
```

```json 
{
  "status": "success",
  "payload": 5,
  "products": [
    {
      "_id": "65c061c7e7934b434e25b6d6",
      "title": "Sweet Potato Fries",
      "description": "Crispy sweet potato fries seasoned to perfection, served with a side of chipotle aioli",
      "price": 5.99,
      "category": "sides",
      "status": true,
      "thumbnail": "https://images.unsplash.com/photo-1529589510304-b7e994a92f60?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "code": "SWEETPOTATOFRIES016",
      "stock": 25
    },
    {
      "_id": "65c061c7e7934b434e25b6d7",
      "title": "Fried Pickles",
      "description": "Dill pickle spears coated in a seasoned batter, deep-fried until crunchy, served with ranch",
      "price": 5.25,
      "category": "sides",
      "status": true,
      "thumbnail": "https://images.unsplash.com/photo-1629386211419-34a63eb83a38?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "code": "FRIEDPICKLES017",
      "stock": 25
    }
  ],
  "totalPages": 3,
  "page": 2,
  "hasPrevPage": true,
  "hasNextPage": true,
  "nextPage": 3,
  "prevPage": 1
}

```
### Get by id

```http
GET /api/products/:id
```

example 
```http
GET /api/products/65c061c7e7934b434e25b6d6
```
```json
{
  "message": "product found",
  "content": {
    "_id": "65c061c7e7934b434e25b6d6",
    "title": "Sweet Potato Fries",
    "description": "Crispy sweet potato fries seasoned to perfection, served with a side of chipotle aioli",
    "price": 5.99,
    "category": "sides",
    "status": true,
    "thumbnail": "https://images.unsplash.com/photo-1529589510304-b7e994a92f60?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "code": "SWEETPOTATOFRIES016",
    "stock": 25
  }
}
```
## Admin Endpoints
E-free allows you to add new products, update the  already existing products catalog and delete them through secured endpoints your Admin could use.

### Add new product
``` http
POST /api/products/
```
In order to add a new product to the existing catalog you must provide in the body of your request a json as the following model:
```json 
 {
     "title": "xiaomi redmi s22",
     "description": "high end cellphone with 32gb ram and 520 gb storage",
     "price": 200.99,
     "category": "   SmartPhones",
     "code": "xiaomiS22",
     "thumbnail": null,
     "status": false,
     "stock": 0
}
```

`title:string` Required and unique.

`description:string` Required.

`code:string` Required, Unique, the request is returning a 400 error if there is another product with the same code.

`category:string` Required, this field is being trim and lowercased in the register process. 

`thumbnail:string` references the url to be use for product's image. Is not required.

`status:boolean` not required, default will be true.

`stock:number` not required, any number less than 0 is not valid,  default will be 0. 

example 

```json 
{
  "message": "product properly added, id: 66425edbb648be21a94dd1de",
  "content": {
    "title": "xiaomi redmi s22",
    "description": "high end cellphone with 32gb ram and 520 gb storage",
    "price": 200.99,
    "category": "smartphones",
    "thumbnail": "https://upload.wikimedia.org/wikipedia/commons/e/ea/No_image_preview.png",
    "status": false,
    "stock": 0,
    "_id": "66425edbb648be21a94dd1de",
    "__v": 0
  }
}
```

### Update an existing product.
``` http
PATCH /api/products/:id
```

E-free allows you to update a product from a single field or some at the same time. The fields you want to update must be place in an json object and only the fields we already define above are taken, otherwise fields will be ignored. 

example
```http
PATCH /api/products/66425edbb648be21a94dd1de

{
    "stock":30,
    "status": true,
    "price": 250.99
}
```

response:

```json
{
  "message": "product properly updated",
  "content": {
    "acknowledged": true,
    "modifiedCount": 1,
    "upsertedId": null,
    "upsertedCount": 0,
    "matchedCount": 1
  }
}

```
if we get the product by id we can se the product was indeep updated.
```json
{
  "message": "product found",
  "content": {
    "_id": "66425edbb648be21a94dd1de",
    "title": "xiaomi redmi s22",
    "description": "high end cellphone with 32gb ram and 520 gb storage",
    "price": 250.99,
    "category": "smartphones",
    "thumbnail": "https://upload.wikimedia.org/wikipedia/commons/e/ea/No_image_preview.png",
    "status": true,
    "stock": 30,
    "__v": 0
  }
}
```

### Delete an existing product.
``` http
DELETE /api/products/:id
```

example
```http 
DELETE /api/products/66425edbb648be21a94dd1de
```

```json
{
  "message": "product  eliminated properly",
  "content": {
    "_id": "66425edbb648be21a94dd1de",
    "title": "xiaomi redmi s22",
    "description": "high end cellphone with 32gb ram and 520 gb storage",
    "price": 250.99,
    "category": "smartphones",
    "thumbnail": "https://upload.wikimedia.org/wikipedia/commons/e/ea/No_image_preview.png",
    "status": true,
    "stock": 30,
    "__v": 0
  }
}
```
Now the product is not longer into the catalog.






## Cart
Cart endpoints provides information about the current status of the shopping cart for each user besides allows add or removes products from it. 

> only users accounts have access to cart endpoints by default.

### Add a product to a user cart

```http
PATCH /api/cart/product/:pid
```
This endpoint requires besides the product id as param, the quantity of products you're adding.

`quantity:number` must be higher or equal to 0. if the quantity is 0 the product will be remove from user's cart.

example 

```http
PATCH /api/cart/product/65c061c7e7934b434e25b6d6
```
body: 
```json
{
    "quantity": 3
}
```
response:
```json
{
  "message": "cart properly updated",
  "content": {
    "acknowledged": true,
    "modifiedCount": 1,
    "upsertedId": null,
    "upsertedCount": 0,
    "matchedCount": 1
  }
}
```

### Get cart information

```http
GET /api/cart/
```

Since each user has an unique cart id there is not need for params to get this. 
the response follows this model:
```javascript
{
    _id:string // cart id,
    products:{
        product:Product,
        quantity:number
    }[]
}
```

example response
```json
{
  "_id": "6642ab2f323727ba02a591b4",
  "products": [
    {
      "product": {
        "_id": "65c061c7e7934b434e25b6d6",
        "title": "Sweet Potato Fries",
        "description": "Crispy sweet potato fries seasoned to perfection, served with a side of chipotle aioli",
        "price": 5.99,
        "category": "sides",
        "status": true,
        "thumbnail": "https://images.unsplash.com/photo-1529589510304-b7e994a92f60?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "code": "SWEETPOTATOFRIES016",
        "stock": 25
      },
      "quantity": 3,
      "_id": "6642b60b014c9e5f015077b0"
    }
  ],
  "__v": 0
}
```

### Delete one product directly

```http
DELETE /api/cart/product/:pid
```
this endpoints removes a product from a cart directly,  just need the product id as params.

example
```http
DELETE /api/cart/product/6642ab2f323727ba02a591b4
```
response:

```json
{
  "message": "product properly removed from cart,  product id 65c061c7e7934b434e25b6d6",
  "content": {
    "acknowledged": true,
    "modifiedCount": 1,
    "upsertedId": null,
    "upsertedCount": 0,
    "matchedCount": 1
  }
}
```

### Go to checkout

```http
GET /api/cart/purchase
```
This endpoints allows user to generate a ticket, checking every product in the cart and also updating products' stock after the order is being made. 
> if at the moment of generate the order there is not enough stock for some product in the user's cart, those products are going to stay in the cart while the other are including in the order. In this case E-free also return a message about that. 

More details in TicketMannager in DAO directory.

response: 
```json
{
  "message": "all products were properly included in your order",
  "ticket": {
    "code": "02bf9bfd375b77051b9807f21887ab89",
    "purchase_datetime": "2024-05-14T00:51:44.110Z",
    "amount": 17.97,
    "products": [
      {
        "product_name": "Sweet Potato Fries",
        "quantity": 3,
        "price": 5.99,
        "product_amount": 17.97,
        "_id": "6642bdf2014c9e5f015077d1"
      }
    ],
    "_id": "6642bdf2014c9e5f015077d0",
    "__v": 0
  },
  "user": "user@mail.com"
}
```
documentation in progress... 

## 🔗 Links

<div align="center">
  <a href="https://www.linkedin.com/in/alexisperdomod/">
    <img src="https://img.shields.io/static/v1?message=LinkedIn&logo=linkedin&label=&color=0077B5&logoColor=white&labelColor=&style=for-the-badge" height="35" alt="linkedin logo"  />
  </a>
</div>

##
