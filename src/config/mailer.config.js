import nodemailer from 'nodemailer'
import envConfig from './dotenv.config.js'
const { mailer_user, mailer_port, mailer_service, mailer_pass } = envConfig

const mailer = nodemailer.createTransport({
    service: mailer_service,
    port: parseInt(mailer_port),
    auth: {
        user: mailer_user,
        pass: mailer_pass
    }
})
export const sendDeleteProductEmail = async (product, usser, reason = 'Product deleted by Admin') => {
    const message = {
        from: mailer_user,
        to: usser.email,
        subject: `Product ${product.title} deleted`,
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Deletion Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: auto;
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #007bff;
            color: #fff;
            padding: 10px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 20px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #aaa;
            padding: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Product Deletion Notification</h1>
        </div>
        <div class="content">
            <p>Dear User,</p>
            <p>We regret to inform you that your product "<strong>${product.title}</strong>" has been removed from our platform. Below are the details of the product:</p>
            <ul>
                <li><strong>Title:</strong> ${product.title}</li>
                <li><strong>Description:</strong> ${product.description}</li>
                <li><strong>Price:</strong> $${product.price}</li>
                <li><strong>Category:</strong> ${product.category}</li>
                <li><strong>Code:</strong> ${product.code}</li>
                <li><strong>Stock:</strong> ${product.stock}</li>
            </ul>
            <p><strong>Reason for Deletion:</strong> ${reason}</p>
            <p>If you have any questions or need further assistance, please contact our support team.</p>
            <p>Thank you for understanding.</p>
            <p>Best regards,</p>
            <p>The Support Team</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Your Company. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`
    }

    return mailer.sendMail(message)
}
export default mailer
