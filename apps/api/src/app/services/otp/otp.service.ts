import { randomUUID } from 'crypto';
import { OtpProvider } from './otp-provider';

interface OtpRecord {
  otp: string;
  expiresAt: Date;
  requestId: string;
}

interface RequestOtpResult {
  requestId: string;
  expiresAt: Date;
  otp?: string;
}

interface OtpServiceConfig {
  staticOtp?: string;
  ttlSeconds: number;
  exposeOtpInResponse: boolean;
}

export class OtpService {
  private readonly otpStore = new Map<string, OtpRecord>();

  constructor(
    private readonly provider: OtpProvider,
    private readonly config: OtpServiceConfig
  ) {}

  async requestOtp(mobileNumber: string): Promise<RequestOtpResult> {
    const otp = this.config.staticOtp || this.generateRandomOtp();
    const expiresAt = new Date(Date.now() + this.config.ttlSeconds * 1000);
    const requestId = randomUUID();

    this.otpStore.set(mobileNumber, {
      otp,
      expiresAt,
      requestId,
    });

    await this.provider.sendOtp({
      mobileNumber,
      otp,
      expiresAt,
    });

    return {
      requestId,
      expiresAt,
      otp: this.config.exposeOtpInResponse ? otp : undefined,
    };
  }

  verifyOtp(mobileNumber: string, otp: string): { isValid: boolean; reason?: string } {
    const record = this.otpStore.get(mobileNumber);

    if (!record) {
      return { isValid: false, reason: 'OTP not requested or expired' };
    }

    if (record.expiresAt.getTime() < Date.now()) {
      this.otpStore.delete(mobileNumber);
      return { isValid: false, reason: 'OTP expired' };
    }

    if (record.otp !== otp) {
      return { isValid: false, reason: 'Invalid OTP' };
    }

    this.otpStore.delete(mobileNumber);
    return { isValid: true };
  }

  private generateRandomOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
