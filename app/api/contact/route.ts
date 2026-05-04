import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const DB_FILE = path.join(process.cwd(), "data", "inquiries.json");

function saveInquiry(data: Record<string, string>) {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const inquiries = fs.existsSync(DB_FILE)
      ? JSON.parse(fs.readFileSync(DB_FILE, "utf-8"))
      : [];
    inquiries.unshift({ id: Date.now().toString(), ...data, status: "New", createdAt: new Date().toISOString() });
    fs.writeFileSync(DB_FILE, JSON.stringify(inquiries, null, 2));
  } catch (e) { console.error("Save inquiry error:", e); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, service, message } = body;

    // Save to local DB
    saveInquiry({ name, phone, email: email || "", service: service || "General", message });

    // Send email
    if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.hostinger.com",
        port: Number(process.env.SMTP_PORT) || 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      const html = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:linear-gradient(135deg,#0056b3,#003d80);padding:30px;text-align:center">
            <h1 style="color:white;margin:0">🔔 New Inquiry!</h1>
            <p style="color:rgba(255,255,255,0.8);margin-top:8px">Vidya IT Services Website</p>
          </div>
          <div style="padding:30px;background:#f9f9f9">
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:10px;font-weight:bold;color:#0056b3;width:30%">Name:</td><td style="padding:10px">${name}</td></tr>
              <tr style="background:#fff"><td style="padding:10px;font-weight:bold;color:#0056b3">Phone:</td><td style="padding:10px"><a href="tel:${phone}">${phone}</a></td></tr>
              <tr><td style="padding:10px;font-weight:bold;color:#0056b3">Email:</td><td style="padding:10px">${email || "Not provided"}</td></tr>
              <tr style="background:#fff"><td style="padding:10px;font-weight:bold;color:#0056b3">Service:</td><td style="padding:10px">${service || "General Inquiry"}</td></tr>
              <tr><td style="padding:10px;font-weight:bold;color:#0056b3;vertical-align:top">Message:</td><td style="padding:10px">${message}</td></tr>
            </table>
            <div style="margin-top:20px;text-align:center">
              <a href="https://wa.me/${phone?.replace(/\D/g,"")}?text=Hello ${name}! I am calling from Vidya IT Services." 
                style="background:#25D366;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">
                💬 Reply on WhatsApp
              </a>
            </div>
          </div>
          <div style="padding:15px;text-align:center;background:#333;color:#fff;font-size:12px">
            Vidya IT Services | 251, Pakka Bagh, Hapur UP | +91 7878407051
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: `"Vidya IT Services" <${process.env.SMTP_USER}>`,
        to: `info@vidyaitservices.com, vaibhav2007sharma@gmail.com`,
        subject: `🔔 New Inquiry from ${name} - ${service || "General"}`,
        html,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json({ success: true }); // Still return success to user
  }
}
