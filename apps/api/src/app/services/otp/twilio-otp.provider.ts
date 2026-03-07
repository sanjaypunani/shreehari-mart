import { OtpProvider, OtpProviderResult, SendOtpInput } from './otp-provider';

interface TwilioOtpProviderConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string;
}

export class TwilioOtpProvider implements OtpProvider {
  constructor(private readonly config: TwilioOtpProviderConfig) {}

  async sendOtp(input: SendOtpInput): Promise<OtpProviderResult> {
    const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${this.config.accountSid}/Messages.json`;
    const body = new URLSearchParams({
      To: this.toE164(input.mobileNumber),
      From: this.config.fromNumber,
      Body: `Your Shreehari Mart OTP is ${input.otp}. It expires in 5 minutes.`,
    });

    const authHeader = Buffer.from(
      `${this.config.accountSid}:${this.config.authToken}`
    ).toString('base64');

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Twilio send OTP failed: ${response.status} ${errorBody}`);
    }

    const data = (await response.json()) as { sid?: string };

    return {
      providerMessageId: data.sid,
    };
  }

  private toE164(mobileNumber: string): string {
    if (mobileNumber.startsWith('+')) {
      return mobileNumber;
    }

    const digits = mobileNumber.replace(/\D/g, '');

    if (digits.length === 12 && digits.startsWith('91')) {
      return `+${digits}`;
    }

    if (digits.length === 10) {
      return `+91${digits}`;
    }

    return `+${digits}`;
  }
}
