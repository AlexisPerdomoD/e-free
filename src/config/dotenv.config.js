// WE'LL USE DOTENV WITH COMMANDER FOR BETTER MANNAGEMENT OF ENV VARIABLE
import dotenv from "dotenv"
import commands from "./commander.config.js"
import  path  from 'path';
import __dirname from '../dirname.js';


let env
switch (commands.opts().mode) {
    case "dev":
        env = ".env.development"
        break
    case "pro":
        env = ".env.production"
        break
 }
dotenv.config({
    path: path.join(__dirname, env)
})

export default {
    port: process.env.PORT,
    db: process.env.DB,
    secret: process.env.SECRET,
    host: process.env.HOST,
    persistence: process.env.PERSISTENCE,
    mode: process.env.MODE
}
