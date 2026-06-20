import { Router } from "express";

const router = Router();

// POST /api/contact
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: "All fields are required.",
      });
    }

    // For now, just log the message in backend console
    console.log("📩 New Contact Message:");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Message:", message);

    return res.status(200).json({
      message: "Your message has been sent successfully!",
    });
  } catch (err) {
    console.error("Contact route error:", err);
    return res.status(500).json({
      error: "Server error. Please try again.",
      details: err.message,
    });
  }
});

export default router;