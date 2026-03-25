export class OtpTemplate {
  static generate(otp: string): string {
    return `
       <div style="
        padding: 40px 20px;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background-color: transparent;
      ">
        <div style="
          max-width: 440px;
          margin: 0 auto;
          background: #0A0E27;
          border: 1px solid rgb(10, 14, 39);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgb(10, 14, 39);
          color: #ffffff;
        ">
          <!-- Header -->
          <div style="
            background: linear-gradient(to bottom, rgba(255,255,255,0.02), transparent);
            padding: 32px 24px;
            text-align: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          ">
            <h1 style="
              margin: 0;
              color: #ffffff;
              font-size: 24px;
              font-weight: 800;
              letter-spacing: -0.5px;
              text-transform: uppercase;
            ">
              <span style="color: #626FF6;">PLANIX</span>
            </h1>
          </div>

          <!-- Content -->
          <div style="padding: 40px 32px; text-align: center;">
            <div style="margin-bottom: 32px;">
              <h2 style="
                margin: 0 0 12px;
                color: #ffffff;
                font-size: 20px;
                font-weight: 700;
              ">
                Verification Code
              </h2>
              <p style="
                margin: 0;
                color: #a1a1aa;
                font-size: 14px;
                line-height: 1.5;
              ">
                Use the following code to complete your security verification.
              </p>
            </div>

            <!-- OTP Box -->
            <div style="
              margin: 0 auto 32px;
              padding: 24px;
              background: #1F2630;
              border: 1px solid rgba(59, 130, 246, 0.2);
              border-radius: 16px;
              box-shadow: 0 0 20px rgba(59, 130, 246, 0.05);
            ">
              <div style="
                font-size: 36px;
                font-weight: 800;
                letter-spacing: 12px;
                color: #626FF6;
                font-family: 'Monaco', 'Consolas', monospace;
                padding-left: 12px;
              ">
                ${otp}
              </div>
            </div>

            <div style="
              padding: 12px;
              background: rgba(255, 255, 255, 0.02);
              border-radius: 8px;
              display: inline-block;
              margin-bottom: 32px;
            ">
              <p style="
                margin: 0;
                color: #71717a;
                font-size: 12px;
                font-weight: 500;
              ">
                Valid for <span style="color: #ffffff;">2 minutes</span>
              </p>
            </div>

            <div style="
              padding-top: 32px;
              border-top: 1px solid rgba(255, 255, 255, 0.05);
            ">
              <p style="
                margin: 0;
                color: #52525b;
                font-size: 12px;
                line-height: 1.5;
              ">
                If you didn't request this code, you can safely ignore this email.
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="
            padding: 24px;
            text-align: center;
            background: rgba(0, 0, 0, 0.2);
          ">
            <p style="
              margin: 0;
              color: #3f3f46;
              font-size: 11px;
              font-weight: 600;
              letter-spacing: 1px;
              text-transform: uppercase;
            ">
              Secured by PLANIX Auth
            </p>
          </div>
        </div>
      </div>
    `;
  }
}
