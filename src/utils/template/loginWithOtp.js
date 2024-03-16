function renderEmailTemplate(email, otp) {
  const htmlTemplate = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Template</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f9f9f9;
      }
      h1 {
        color: #333;
      }
      p {
        color: #666;
      }
      .button {
        display: inline-block;
        padding: 10px 20px;
        background-color: #007bff;
        color: #fff;
        text-decoration: none;
        border-radius: 4px;
      }
      .button:hover {
        background-color: #0056b3;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Welcome to Our bpfofficial!</h1>
      <p>Thank you for choosing Bodoland People's Front(BPF). We're excited to have you on board.</p>
<p> this is your one time OTP: ${otp} for you Email: ${email}. It will expire in 5 minutes. Please verify your OTP  and complete the registration.
    </div>
  </body>
</html>

`;
  return htmlTemplate;
}
module.exports = { renderEmailTemplate: renderEmailTemplate };
