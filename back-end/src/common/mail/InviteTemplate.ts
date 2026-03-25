export class InviteTemplate {
  static generate(inviteLink: string): string {
    return `
      <div style="font-family: Arial, sans-serif;">
        <h2>You’ve been invited to join a workspace</h2>
        <p>Click the button below to accept the invitation:</p>
        <a href="${inviteLink}" 
           style="
             display:inline-block;
             padding:10px 20px;
             background:#4CAF50;
             color:white;
             text-decoration:none;
             border-radius:5px;">
          Accept Invitation
        </a>
        <p>If you didn’t expect this invite, you can ignore this email.</p>
      </div>
    `;
  }
}
