require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const express = require("express");
const cors = require("cors");
const twilio = require("twilio");

const client = twilio(accountSid, authToken);
const app = express();

app.use(cors());
app.use(express.json());

let otpStore = {};

app.post("/send-otp", async (req, res) => {
    const phone = req.body.phone;
    const fullPhone = "+91" + phone;

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[fullPhone] = otp;

    try {
        await client.messages.create({
            body: `*${otp}* is your verification code.`,
            from: "whatsapp:+14155238886",
            to: `whatsapp:${fullPhone}`
        });

        res.send("OTP sent");
    } catch (err) {
        console.log(err);
        res.send("Error");
    }
});

app.post("/verify-otp", (req, res) => {
    const { phone, otp } = req.body;
    const fullPhone = "+91" + phone;

    console.log("STORE:", otpStore);
    console.log("CHECK:", fullPhone, otp);

    if (otpStore[fullPhone] && String(otpStore[fullPhone]) === String(otp)) {
        delete otpStore[fullPhone];
        res.send("Verified");
    } else {
        res.send("Invalid OTP");
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});