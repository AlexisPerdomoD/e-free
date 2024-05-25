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
    mode: process.env.MODE,
    admin: process.env.ADMIN,
    mailer_user: process.env.MAILER_USER,
    mailer_pass: process.env.MAILER_PASS,
    mailer_service: process.env.MAILER_SERVICE,
    mailer_port:process.env.MAILER_PORT
}
