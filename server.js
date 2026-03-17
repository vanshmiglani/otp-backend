require("dotenv").config();

const express = require("express");
const cors = require("cors");
const twilio = require("twilio");

const app = express();
app.use(cors());
app.use(express.json());

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

let otpStore = {};

// ✅ SEND OTP
app.post("/send-otp", async (req, res) => {
    const phone = req.body.phone;
    const fullPhone = "+91" + phone;

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[fullPhone] = otp;

    console.log("SAVED OTP:", fullPhone, otp);

    try {
        await client.messages.create({
            body: `*${otp}* is your verification code.`,
            from: "whatsapp:+14155238886",
            to: `whatsapp:${fullPhone}`
        });

        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }
});

// ✅ VERIFY OTP
app.post("/verify-otp", (req, res) => {
    const { phone, otp } = req.body;
    const fullPhone = "+91" + phone;

    console.log("STORE:", otpStore);
    console.log("CHECK:", fullPhone, otp);

    if (String(otpStore[fullPhone]) === String(otp)) {
        delete otpStore[fullPhone];
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
