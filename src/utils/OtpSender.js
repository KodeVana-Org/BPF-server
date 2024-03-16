const nodemailer = require("nodemailer");
const twilio = require("twilio");

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
  const accountSid = process.env.ACCOUNT_SID;
  const authToken = process.env.AUTH_TOKEN;
  const twilioPhoneNumber = process.env.PHONE_NO;

  const client = twilio(accountSid, authToken);
  console.log(phoneNumber, otp);
  console.log(accountSid, authToken, twilioPhoneNumber);

  client.messages
    .create({
      body: `Your OTP is: ${otp}`,
      from: twilioPhoneNumber,
      to: phoneNumber,
    })
    .then((message) =>
      console.log(`OTP sent to ${phoneNumber} via SMS: ${message.sid}`),
    )
    .catch((error) => console.error("Error sending OTP via SMS:", error));
}

module.exports = { sendOTPByEmail, sendOTPViaSMS };
