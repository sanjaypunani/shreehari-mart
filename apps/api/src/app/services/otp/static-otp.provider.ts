import { OtpProvider, OtpProviderResult, SendOtpInput } from './otp-provider';

export class StaticOtpProvider implements OtpProvider {
  async sendOtp(input: SendOtpInput): Promise<OtpProviderResult> {
    console.log(
      `[StaticOtpProvider] OTP for ${input.mobileNumber}: ${input.otp} (expires at ${input.expiresAt.toISOString()})`
    );

    return {
      providerMessageId: `static-${Date.now()}`,
    };
  }
}
