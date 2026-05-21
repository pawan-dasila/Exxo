import { Resend } from "resend";
import { Env } from '../configs/env.config.js';
import logger from '../utils/logger.js';

export class MailService {
  private static resend = new Resend(Env.RESEND_API_KEY);

  public static async sendVerificationEmail(
    to: string,
    name: string,
    token: string,
  ) {
    try {
      const verifyUrl = `${Env.FRONTEND_ORIGIN}/verify-email?token=${token}`;
      const greeting = name ? `Hi ${name},` : "Hi there,";

      const html = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #fafafa;">
          <div style="background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
            <h1 style="color: #111827; margin: 0 0 8px 0; font-size: 24px;">Verify Your Email</h1>
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 24px 0;">EXXO</p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              ${greeting}
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Thank you for signing up for <strong>EXXO</strong>! To complete your registration
              and unlock all features, please verify your email address by clicking the button below.
            </p>
            <div style="margin: 32px 0; text-align: center;">
              <a href="${verifyUrl}" style="background-color: #111827; color: #ffffff; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">
              This link will expire in <strong>24 hours</strong>. If you did not create an account, 
              you can safely ignore this email.
            </p>
            <hr style="margin: 32px 0; border: 0; border-top: 1px solid #e5e7eb;" />
            <p style="color: #9ca3af; font-size: 12px;">
              If the button doesn't work, copy and paste this link into your browser:<br/>
              <a href="${verifyUrl}" style="color: #6366f1; word-break: break-all;">${verifyUrl}</a>
            </p>
          </div>
        </div>
      `;

      const { data, error } = await this.resend.emails.send({
        from: Env.RESEND_MAILER_SENDER,
        to: [to],
        subject: "Verify your email - EXXO",
        html,
      });

      if (error) {
        logger.error(error, "Resend Email Verification Error");
        return { success: false, error };
      }

      return { success: true, id: data?.id };
    } catch (error) {
      logger.error(error, "Mail Service Verification Error");
      return { success: false, error };
    }
  }

  public static async sendPasswordResetEmail(
    to: string,
    name: string,
    token: string,
  ) {
    try {
      const resetUrl = `${Env.FRONTEND_ORIGIN}/reset-password?token=${token}`;
      const greeting = name ? `Hi ${name},` : "Hi there,";

      const html = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #fafafa;">
          <div style="background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
            <h1 style="color: #111827; margin: 0 0 8px 0; font-size: 24px;">Reset Your Password</h1>
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 24px 0;">EXXO</p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              ${greeting}
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              We received a request to reset your password for your <strong>EXXO</strong> account. 
              Click the button below to choose a new password.
            </p>
            <div style="margin: 32px 0; text-align: center;">
              <a href="${resetUrl}" style="background-color: #111827; color: #ffffff; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">
              This link will expire in <strong>24 hours</strong>. If you did not request a password reset, 
              you can safely ignore this email and your password will remain unchanged.
            </p>
            <hr style="margin: 32px 0; border: 0; border-top: 1px solid #e5e7eb;" />
            <p style="color: #9ca3af; font-size: 12px;">
              If the button doesn't work, copy and paste this link into your browser:<br/>
              <a href="${resetUrl}" style="color: #6366f1; word-break: break-all;">${resetUrl}</a>
            </p>
          </div>
        </div>
      `;

      const { data, error } = await this.resend.emails.send({
        from: Env.RESEND_MAILER_SENDER,
        to: [to],
        subject: "Reset your password - EXXO",
        html,
      });

      if (error) {
        logger.error(error, "Resend Password Reset Error");
        return { success: false, error };
      }

      return { success: true, id: data?.id };
    } catch (error) {
      logger.error(error, "Mail Service Password Reset Error");
      return { success: false, error };
    }
  }
}
