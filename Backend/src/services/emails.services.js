require("dotenv").config();
const nodemailer = require("nodemailer");
/**

 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Connection verify করা
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});



// Email পাঠানোর function
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your Name" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function  sendOtpEmail(userEmail , name , otp ) {
    const subject = "Welcome To SongUpload" ; 
    const text = `Hello ${name} , \n\n This is Your OTP : ${otp} `; 
    const html = `<p>Hello ${name} </p> <p> This Is Your ${otp}</p>` 

    await sendEmail(userEmail , subject , text , html )
}
module.exports = {sendEmail ,transporter , sendOtpEmail};
