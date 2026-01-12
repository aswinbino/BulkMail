const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// ✅ MongoDB connection (FIXED)
mongoose
  .connect(
    "mongodb+srv://aswinbino004:Aswinmohan20@cluster0.fuyj53q.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("DB connection error:", err));

// ✅ Correct model
const Credential = mongoose.model(
  "Credential",
  new mongoose.Schema({
    user: String,
    pass: String,
  }),
  "bulkmail"
);

// ✅ API
app.post("/sendmail", async (req, res) => {
  try {
    const { msg, emailList } = req.body;

    if (!msg || !emailList || emailList.length === 0) {
      return res.status(400).json(false);
    }

    const creds = await Credential.findOne();

    if (!creds || !creds.user || !creds.pass) {
      console.error(" Invalid mail credentials in DB");
      return res.status(500).json(false);
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: creds.user,
        pass: creds.pass,
      },
    });

    for (const email of emailList) {
      await transporter.sendMail({
        from: creds.user,
        to: email,
        subject: "Bulk Mail",
        text: msg,
      });
      console.log("📧 Email sent to:", email);
    }

    res.json(true);
  } catch (err) {
    console.error(" Mail error:", err);
    res.status(500).json(false);
  }
});


app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});

