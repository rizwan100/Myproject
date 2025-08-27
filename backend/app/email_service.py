import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

class EmailService:
    @staticmethod
    def send_verification_email(email: str, verification_token: str, user_name: str = "User") -> bool:
        """Send email verification email to user"""
        try:
            email_host = os.getenv("EMAIL_HOST", "smtp.gmail.com")
            email_port = int(os.getenv("EMAIL_PORT", "587"))
            email_user = os.getenv("EMAIL_USER", "aasanrishtecontact@gmail.com")
            email_password = os.getenv("EMAIL_PASSWORD")
            email_from = os.getenv("EMAIL_FROM", "aasanrishtecontact@gmail.com")
            app_url = os.getenv("APP_URL", "http://localhost:3000").rstrip("/")  # remove trailing slash if exists

            if not email_password or email_password == "your-email-password":
                print(f"Development mode: Simulating email send to {email}")
                print(f"Verification URL: {app_url}verify-email?token={verification_token}")
                return True
            
            verification_url = f"{app_url}/verify-email?token={verification_token}"

            
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Verify Your Email - Aasan Rishte</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #e11d48;">❤️ Aasan Rishte</h1>
                    </div>
                    
                    <h2>Welcome to Aasan Rishte!</h2>
                    
                    <p>Dear {user_name},</p>
                    
                    <p>Thank you for registering with Aasan Rishte. To complete your registration and start finding your perfect life partner, please verify your email address by clicking the button below:</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{verification_url}" 
                           style="background-color: #e11d48; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                            Verify Email Address
                        </a>
                    </div>
                    
                    <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; color: #666;">{verification_url}</p>
                    
                    <p>This verification link will expire in 24 hours for security reasons.</p>
                    
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                    
                    <p style="font-size: 14px; color: #666;">
                        If you didn't create an account with Aasan Rishte, please ignore this email.
                    </p>
                    
                    <div style="text-align: center; margin-top: 30px; font-size: 14px; color: #666;">
                        <p>Need help? Contact us at <a href="mailto:aasanrishtecontact@gmail.com">aasanrishtecontact@gmail.com</a></p>
                        <p>Or reach us on WhatsApp: <a href="https://wa.me/+917569319126">+91 7569319126</a></p>
                        <p>© 2025 Aasan Rishte. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            msg = MIMEMultipart('alternative')
            msg['Subject'] = "Verify Your Email - Welcome to Aasan Rishte"
            msg['From'] = f"Aasan Rishte <{email_from}>"
            msg['To'] = email
            
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)
            
            server = smtplib.SMTP(email_host, email_port)
            server.starttls()
            server.login(email_user, email_password)
            text = msg.as_string()
            server.sendmail(email_from, email, text)
            server.quit()
            
            print(f"Verification email sent successfully to {email}")
            return True
            
        except Exception as e:
            print(f"Error sending verification email: {e}")
            return False
