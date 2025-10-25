const express = require("express");
const cors = require("cors");


const app = express();
app.use(cors());
app.use(express.json());

app.post("/send-segment", async (req, res) => {
  try {
    const response = await fetch("https://webhook.site/9dce9685-eb00-46bc-a820-a7ab3e5b4beb", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));
