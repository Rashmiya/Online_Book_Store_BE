import cron from "node-cron";
import Wishlist from "../models/wishlist.model";
import nodemailer from "nodemailer";

// Set up nodemailer (use real credentials in production)
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Run every minute (you can change this interval as needed)
cron.schedule("* * * * *", async () => {
  const now = new Date();

  // Get all reminders that match the current time (to minute)
  const wishes = await Wishlist.find({
    reminderDate: {
      $lte: now,
      $gt: new Date(now.getTime() - 60 * 1000), // in last 1 min
    },
  }).populate("bookId"); 
  for (const wish of wishes) {
    if (!wish.email) continue;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: wish.email,
      subject: "📚 Reminder: Don’t Miss Out on This Book!",
      text: `Hi there,

This is a friendly reminder about the book: "${
        (wish.bookId as any).title || "Unknown Title"
      }".

📖 Why you should consider buying this book:
This book offers deep insights and valuable knowledge that can inspire, educate, or entertain you—depending on your interests. It’s a great addition to your personal collection and could be exactly what you’re looking for.

📝 Your Note: ${wish.note || "No personal note was added."}

Don’t miss the opportunity to get your hands on this great read!

Happy reading,
Your Bookstore Team`,
    };

    try {
      await transporter.sendMail(mailOptions); 
    } catch (err: any) {
      console.error("Email send failed:", err.message);
    }
  }
});
