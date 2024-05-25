import nodemailer from "nodemailer"
import {
    mailer_user,
    mailer_port,
    mailer_service,
    mailer_pass
} from "./dotenv.config"



const mailer = nodemailer.createTransport({
    service:mailer_service,
    port:mailer_port,
    auth:{
        user: mailer_user,
        pass:mailer_pass
    }
})

export default  mailer
