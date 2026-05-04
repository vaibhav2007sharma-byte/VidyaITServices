import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, service, message } = body;

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0056b3, #003d80); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Inquiry - Vidya IT Services</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px; font-weight: bold; color: #0056b3;">Name:</td><td>${name}</td></tr>
            <tr style="background: #fff;"><td style="padding: 10px; font-weight: bold; color: #0056b3;">Phone:</td><td>${phone}</td></tr>
            <tr><td style="padding: 10px; font-weight: bold; color: #0056b3;">Email:</td><td>${email || "Not provided"}</td></tr>
            <tr style="background: #fff;"><td style="padding: 10px; font-weight: bold; color: #0056b3;">Service:</td><td>${service || "General Inquiry"}</td></tr>
            <tr><td style="padding: 10px; font-weight: bold; color: #0056b3; vertical-align: top;">Message:</td><td>${message}</td></tr>
          </table>
        </div>
        <div style="padding: 15px; text-align: center; background: #333; color: #fff; font-size: 12px;">
          <p>Vidya IT Services | 251, Pakka Bagh, Hapur UP | +91 7878407051</p>
        </div>
      </div>
    `;

    // Send to both emails
    await transporter.sendMail({
      from: `"Vidya IT Services" <${process.env.SMTP_USER}>`,
      to: "info@vidyaitservices.com, vaibhav2007sharma@gmail.com",
      subject: `New Inquiry from ${name} - ${service || "General"}`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ success: false, error: "Email failed" }, { status: 500 });
  }
}
