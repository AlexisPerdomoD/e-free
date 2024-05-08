import winston, {format, transports} from "winston"
import envConfig from "./dotenv.config.js"

const custom ={
    levels:{
        fatal:0,
        error:1, 
        warning:2,
        info:3,
        debug:4,
        http:5
    },
    colors:{
        fatal:"red",
        error:"orange",
        waring:"yellow",
        info:"green",
        debug:"white",
        http:"blue"
    }
}
const logger = winston.createLogger({
    levels: custom.levels,
    transports:[
        new transports.Console({
            level:envConfig.mode === "PRO" ? "warning" : "http",
            format: format.combine(
                format.colorize({colors:custom.colors}),
                format.simple()
            )
        })
    ]
})
envConfig.mode === "PRO" 
    && logger.transports.push(new transports.File({
        level:"warning",
        filename:"./info/errors.log",
        format: format.simple()
    }))

export const loggerMidleware = (req, _res, next)=>{
    req.logger = logger
    req.logger.http(`${req.method} in ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
}

export default logger
    
