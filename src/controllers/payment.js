const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/payment.Model");

exports.Pyament = async (req, res) => {
  try {
    const { name, email, amount } = req.body;

    if (!amount || !email || !name) {
      return res.status(404).json({
        success: false,
        message: "All fields are required !",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    // Validate amount (should be a positive number)
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount. Please provide a valid positive number.",
      });
    }
    // Create a PaymentIntent with the specified amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "inr",
      receipt_email: email,
      description: `Payment for ${name}`,
      metadata: {
        name: name,
        email: email,
      },
    });

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Payment for ${name}`,
            },
            unit_amount: amount * 100, // Convert amount to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
      metadata: {
        name: name,
        email: email,
      },
    });

    const payment = new Payment({
      name: name,
      email: email,
      amount: amount,
      stripeCustomerId: paymentIntent.id,
      paymentStatus: "success",
    });
    await payment.save();
    res
      .status(200)
      .json({ sessionId: session.id, success: true, paymentIntent });
  } catch (error) {
    console.log("error processing payment:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to process payment" });
  }
};
