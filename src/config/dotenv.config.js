// WE'LL USE DOTENV WITH COMMANDER FOR BETTER MANNAGEMENT OF ENV VARIABLE
import dotenv from "dotenv"
import commands from "./commander.config.js"
import  path  from 'path';

    dotenv.config({
        path: path.join(process.env.PWD, commands.opts().mode === "dev" ? "src/.env.development" : "src/.env.production"),
    })
export default {
    port: process.env.PORT,
    db: process.env.DB,
    secret: process.env.SECRET
}