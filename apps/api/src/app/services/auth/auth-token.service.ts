import crypto from 'crypto';

export interface AuthTokenPayload {
  sub: string;
  role: string;
  customerId: string | null;
  mobileNumber: string;
  iat: number;
  exp: number;
}

export class AuthTokenService {
  constructor(
    private readonly secret: string,
    private readonly expiresInSeconds: number
  ) {}

  generateToken(payload: Omit<AuthTokenPayload, 'iat' | 'exp'>): string {
    const now = Math.floor(Date.now() / 1000);
    const fullPayload: AuthTokenPayload = {
      ...payload,
      iat: now,
      exp: now + this.expiresInSeconds,
    };

    const encodedPayload = this.base64UrlEncode(
      Buffer.from(JSON.stringify(fullPayload))
    );
    const signature = this.sign(encodedPayload);

    return `${encodedPayload}.${signature}`;
  }

  verifyToken(token: string): AuthTokenPayload | null {
    const [encodedPayload, signature] = token.split('.');

    if (!encodedPayload || !signature) {
      return null;
    }

    const expectedSignature = this.sign(encodedPayload);

    if (signature !== expectedSignature) {
      return null;
    }

    try {
      const payload = JSON.parse(
        this.base64UrlDecode(encodedPayload).toString('utf8')
      ) as AuthTokenPayload;

      if (payload.exp <= Math.floor(Date.now() / 1000)) {
        return null;
      }

      return payload;
    } catch {
      return null;
    }
  }

  private sign(value: string): string {
    return this.base64UrlEncode(
      crypto.createHmac('sha256', this.secret).update(value).digest()
    );
  }

  private base64UrlEncode(buffer: Buffer): string {
    return buffer
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  private base64UrlDecode(value: string): Buffer {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padding = normalized.length % 4;

    const padded = padding
      ? `${normalized}${'='.repeat(4 - padding)}`
      : normalized;

    return Buffer.from(padded, 'base64');
  }
}
