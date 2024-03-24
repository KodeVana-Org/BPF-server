const nodemailer = require("nodemailer");
const twilio = require("twilio");
const Nexmo = require("nexmo");

function sendOTPByEmail(email, otp, htmlTemplate) {
  // You need to configure nodemailer with your email provider
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.MAIL_EMAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  console.log();
  const mailOptions = {
    from: "BPF-OTP-Verification x",
    to: email,
    subject: "OTP Verification",
    html: htmlTemplate,
    text: `Your OTP for email ${email} is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

// Send OTP to a phone number

function sendOTPViaSMS(phoneNumber, otp) {
  // Initialize Nexmo client with your API credentials
  const nexmo = new Nexmo({
    apiKey: process.env.NEXMO_API_KEY,
    apiSecret: process.env.NEXMO_API_SECRET,
  });

  const from = "FROM BPF"; // Choose a sender ID provided by Nexmo
  const to = phoneNumber;
  const text = `Your OTP is: ${otp}`;

  console.log("OTP sent to:", phoneNumber);
  console.log("OTP:", otp);
  console.log("Details:", from, to, text);
  nexmo.message.sendSms(from, to, text, (err, responseData) => {
    if (err) {
      console.error("Error sending OTP:", err);
    } else {
      console.log("OTP sent successfully:", responseData);
    }
  });
}

// const accountSid = process.env.ACCOUNT_SID;
// const authToken = process.env.AUTH_TOKEN;
// const twilioPhoneNumber = process.env.PHONE_NO;
//
// const client = new twilio(accountSid, authToken);
//
// function sendOTPViaSMS(phoneNumber, otp) {
//   const to = phoneNumber;
//   const message = `Your OTP is: ${otp}`;
//
//   console.log("OTP sent to:", phoneNumber);
//   console.log("OTP:", otp);
//   console.log("Message:", message);
//
//   client.messages
//     .create({
//       body: message,
//       from: twilioPhoneNumber,
//       to: to,
//     })
//     .then((message) => console.log("OTP sent successfully:", message.sid))
//     .catch((error) => console.error("Error sending OTP:", error));
// }

module.exports = { sendOTPByEmail, sendOTPViaSMS };
