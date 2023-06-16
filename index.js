require("dotenv").config();

const express = require("express");
const cors = require("cors");
const formData = require("form-data");
const Mailgun = require("mailgun.js");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  try {
    res.status(200).json({ message: "Welcome" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/form/new-message", async (req, res) => {
  try {
    const { firstname, lastname, email, message } = req.body;

    console.log(process.env.MAILGUN_API_KEY);
    // ==+> utilisation de Mailgun
    const mailgun = new Mailgun(formData);
    const client = mailgun.client({
      username: "Damien",

      key: process.env.MAILGUN_API_KEY,
    });
    const messageData = {
      from: `${firstname} ${lastname} ${email}`,
      to: "damien.bourcheix@gmail.com",
      subject: "Hello",
      text: message,
    };

    const response = await client.messages.create(
      process.env.MAILGUN_DOMAIN,
      messageData
    );
    // console.log("response>>", response);
    res.status(200).json(response);
  } catch (error) {
    console.error("catch>>", error);
  }
});

app.all("*", (req, res) => {
  try {
    res.status(404).json({ message: "No route" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT} ✈️✈️✈️`);
});
