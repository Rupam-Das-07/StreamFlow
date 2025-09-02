import nodemailer from 'nodemailer';

// Email configuration - using a test account for development
const transporter = nodemailer.createTransporter({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'test@ethereal.email',
    pass: process.env.EMAIL_PASS || 'test-password'
  }
});

// For development/testing, we'll log emails instead of sending them
const isDevelopment = process.env.NODE_ENV === 'development';

// Email templates
export const emailTemplates = {
  verificationEmail: (username: string, verificationToken: string) => ({
    subject: 'Verify Your StreamFlow Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎵 StreamFlow</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Your Music Journey Starts Here</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Welcome to StreamFlow, ${username}! 🎉</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Thank you for joining StreamFlow! To complete your registration and start discovering amazing music, 
            please verify your email address by clicking the button below.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; 
                      text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; 
                      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
              ✅ Verify Email Address
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            If the button doesn't work, you can copy and paste this link into your browser:
          </p>
          
          <p style="background: #f8f9fa; padding: 15px; border-radius: 5px; word-break: break-all; color: #666; font-size: 14px;">
            ${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              This link will expire in 24 hours. If you didn't create a StreamFlow account, 
              you can safely ignore this email.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© 2024 StreamFlow. All rights reserved.</p>
          <p>This email was sent from StreamFlow to verify your account.</p>
        </div>
      </div>
    `
  }),

  accountDeleted: (username: string) => ({
    subject: 'Your StreamFlow Account Has Been Deleted',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎵 StreamFlow</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Goodbye, ${username} 👋</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            We're sorry to see you go! Your StreamFlow account has been successfully deleted as requested.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">What happens next:</h3>
            <ul style="color: #666; line-height: 1.6;">
              <li>All your personal data has been permanently removed</li>
              <li>Your playlists and liked videos have been deleted</li>
              <li>Your watch history has been cleared</li>
              <li>You can create a new account anytime</li>
            </ul>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            If you change your mind, you can always create a new account and start fresh. 
            We hope to see you again soon!
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© 2024 StreamFlow. All rights reserved.</p>
        </div>
      </div>
    `
  })
};

// Send email function
export const sendEmail = async (to: string, template: { subject: string; html: string }) => {
  try {
    // In development, just log the email instead of sending it
    if (isDevelopment) {
      console.log('📧 EMAIL WOULD BE SENT:');
      console.log('To:', to);
      console.log('Subject:', template.subject);
      console.log('Content:', template.html);
      console.log('📧 END EMAIL LOG');
      return { success: true, messageId: 'dev-log-' + Date.now() };
    }

    const mailOptions = {
      from: `"StreamFlow" <${process.env.EMAIL_USER || 'test@ethereal.email'}>`,
      to,
      subject: template.subject,
      html: template.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    // In development, don't fail the request if email fails
    if (isDevelopment) {
      console.log('Email failed but continuing in development mode');
      return { success: true, messageId: 'dev-fallback-' + Date.now() };
    }
    return { success: false, error };
  }
};

// Send verification email
export const sendVerificationEmail = async (email: string, username: string, verificationToken: string) => {
  const template = emailTemplates.verificationEmail(username, verificationToken);
  return await sendEmail(email, template);
};

// Send account deletion confirmation
export const sendAccountDeletedEmail = async (email: string, username: string) => {
  const template = emailTemplates.accountDeleted(username);
  return await sendEmail(email, template);
};

export default transporter;
