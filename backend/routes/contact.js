import { Router } from "express";
import Contact from "../models/Contact.js";

const router = Router();

// POST /api/contact — submit a contact form
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const submission = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      message: "Thank you! Your message has been received.",
      submission,
    });
  } catch (err) {
    console.error("Contact submission error:", err);
    res.status(500).json({ error: "Server error." });
  }
});

export default router;
