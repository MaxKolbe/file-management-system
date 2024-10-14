import nodemailer from "nodemailer"
import dotenv from 'dotenv'
dotenv.config()


var transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: 465, // Usually, port 465 for SSL or 587 for TLS
    secure: true, 
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EPASSWORD
    }
}) 

const sendEmail = (email, token, username, req, res) => {
    
    var mailOptions = { 
        from: process.env.EMAIL,
        to: email,
        subject: ` Password Reset Request for Your Obra FMS Account`,
        html: `<p>Dear ${username},</p>
        <p>We have received a request to reset the password for your FMS account. To ensure the security of your account, we are providing you with the necessary steps to reset your password.</p>
        <p>Please follow the instructions below to reset your password:</p>
        <ol>
            <li>Click on the following link to access the password reset page: <a href="https://${req.headers.host}/resetPassword/${token}" target="_blank" rel="noopener noreferrer">RESET</a></li>
            <li>Once you land on the password reset page, you will be prompted to enter a new password. Choose a strong password that includes a combination of uppercase and lowercase letters, numbers, and special characters to enhance your account's security.</li>
            <li>After setting your new password, click on the "Reset Password" or "Save Changes" button to finalize the process.</li>
        </ol>
        <p>Please note that this password reset link will expire within an hour for security reasons. If you do not reset your password within this timeframe, you will need to initiate the reset process again.</p>
        <p>If you did not initiate this password reset request, please ignore this email, and your account will remain secure. However, if you suspect any unauthorized activity or believe your account has been compromised, we recommend contacting our support team immediately for further assistance.</p>
        <p>Thank you for your attention to this matter. Should you have any questions or require further assistance, please don't hesitate to reach out to our support team at info@obralegal.com (+234 704 227 4824).</p>
        <p>Best regards,<br>Obra Legal</p>`   
    }

    transporter.sendMail(mailOptions, (err, info)=>{
        if(err){
            console.log(`There was an error ${err}`)
            res.status(400).json({message: "There was an error"})
        }else{ 
            res.status(200).redirect('forgotPassword/?message=Reset+mail+sent+successfully')
        } 
    })    
}

export default sendEmail