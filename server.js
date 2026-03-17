const express = require("express");
const cors = require("cors");
const twilio = require("twilio");
const path = require("path");
require("dotenv").config();

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const app = express();
app.use(cors());
app.use(express.json());
let otpStore = {};
app.post("/send-otp", async (req, res) => {
  const phone = req.body.phone;

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[phone] = otp;

  try {
    await client.messages.create({
      body: `*${otp}* is your verification code. For your security, do not share this code.`,
      from: "whatsapp:+14155238886",
      to: `whatsapp:+91${phone}`
    });

    res.send("OTP sent");
  } catch (err) {
    console.log(err);
    res.send("Error");
  }
});
app.post("/verify-otp", (req, res) => {
  const { phone, otp } = req.body;

  if (otpStore[phone] == otp) {
    delete otpStore[phone]; // clean after success
    res.send("Verified");
  } else {
    res.send("Invalid OTP");
  }
});
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
