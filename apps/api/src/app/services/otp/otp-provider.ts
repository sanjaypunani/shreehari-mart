export interface SendOtpInput {
  mobileNumber: string;
  otp: string;
  expiresAt: Date;
}

export interface OtpProviderResult {
  providerMessageId?: string;
}

export interface OtpProvider {
  sendOtp(input: SendOtpInput): Promise<OtpProviderResult>;
}
