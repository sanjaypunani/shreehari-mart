import { Router } from 'express';
import {
  AppDataSource,
  CustomerRepository,
  DatabaseService,
} from '@shreehari/data-access';
import { OtpProvider } from '../services/otp/otp-provider';
import { OtpService } from '../services/otp/otp.service';
import { StaticOtpProvider } from '../services/otp/static-otp.provider';
import { TwilioOtpProvider } from '../services/otp/twilio-otp.provider';
import { AuthTokenPayload, AuthTokenService } from '../services/auth/auth-token.service';

interface UserRecord {
  id: string;
  mobileNumber: string;
  email?: string | null;
  role: string;
  isActive: boolean;
}

interface AuthContext {
  user: UserRecord;
  payload: AuthTokenPayload;
}

const router = Router();

const otpProvider = createOtpProvider();
const otpTtlSeconds = parseInt(process.env.OTP_TTL_SECONDS || '300', 10);
const exposeOtpInResponse = process.env.OTP_EXPOSE_IN_RESPONSE
  ? process.env.OTP_EXPOSE_IN_RESPONSE === 'true'
  : process.env.NODE_ENV !== 'production';

const otpService = new OtpService(otpProvider, {
  staticOtp: process.env.STATIC_OTP?.trim() || undefined,
  ttlSeconds: Number.isFinite(otpTtlSeconds) ? otpTtlSeconds : 300,
  exposeOtpInResponse,
});

const tokenExpiresInSeconds = parseInt(
  process.env.AUTH_TOKEN_EXPIRES_IN_SECONDS || '2592000',
  10
);

const authTokenService = new AuthTokenService(
  process.env.AUTH_TOKEN_SECRET || 'change-this-secret-in-production',
  Number.isFinite(tokenExpiresInSeconds) ? tokenExpiresInSeconds : 2592000
);

router.post('/request-otp', async (req, res) => {
  try {
    const mobileNumber = normalizeMobileNumber(req.body?.mobileNumber);

    if (!mobileNumber || mobileNumber.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Valid 10 digit mobile number is required',
      });
    }

    const dbService = DatabaseService.getInstance();
    const customerRepo = dbService.getCustomerRepository();
    const customer = await findCustomerByMobile(customerRepo, mobileNumber);

    const otp = await otpService.requestOtp(mobileNumber);

    return res.json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        requestId: otp.requestId,
        mobileNumber,
        expiresAt: otp.expiresAt,
        otp: otp.otp,
        isRegisteredCustomer: Boolean(customer),
      },
    });
  } catch (error) {
    console.error('Error requesting OTP:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to request OTP',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const mobileNumber = normalizeMobileNumber(req.body?.mobileNumber);
    const otp = `${req.body?.otp || ''}`.trim();

    if (!mobileNumber || mobileNumber.length !== 10 || otp.length !== 6) {
      return res.status(400).json({
        success: false,
        message: 'Valid mobile number and 6 digit OTP are required',
      });
    }

    const verification = otpService.verifyOtp(mobileNumber, otp);

    if (!verification.isValid) {
      return res.status(400).json({
        success: false,
        message: verification.reason || 'OTP verification failed',
      });
    }

    const dbService = DatabaseService.getInstance();
    const customerRepo = dbService.getCustomerRepository();
    const customer = await findCustomerByMobile(customerRepo, mobileNumber);

    const user = await upsertUserByMobile({
      mobileNumber,
      email: customer?.email,
      existingUserId: customer?.userId || undefined,
    });

    if (customer && (!customer.userId || customer.userId !== user.id)) {
      await AppDataSource.query(
        `UPDATE customers SET "userId" = $1, "updatedAt" = now() WHERE id = $2`,
        [user.id, customer.id]
      );
    }

    const token = authTokenService.generateToken({
      sub: user.id,
      role: user.role,
      customerId: customer?.id || null,
      mobileNumber,
    });

    return res.json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        token,
        requiresSignup: !customer,
        user: {
          id: user.id,
          role: user.role,
          mobileNumber: user.mobileNumber,
          email: user.email,
          name: customer?.name || '',
          customerId: customer?.id || null,
        },
        customer: customer ? mapCustomerForAuthResponse(customer) : null,
      },
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify OTP',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.post('/complete-signup', async (req, res) => {
  try {
    const authContext = await authenticateRequest(req.headers.authorization);

    if (!authContext) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    const { payload, user } = authContext;

    if (payload.customerId) {
      const dbService = DatabaseService.getInstance();
      const existingCustomer = await dbService
        .getCustomerRepository()
        .findById(payload.customerId);

      if (existingCustomer) {
        return res.status(400).json({
          success: false,
          message: 'Signup already completed for this account',
        });
      }
    }

    const name = `${req.body?.name || ''}`.trim();
    const email = `${req.body?.email || ''}`.trim().toLowerCase();
    const societyId = `${req.body?.societyId || ''}`.trim();
    const buildingId = `${req.body?.buildingId || ''}`.trim();
    const flatNumber = `${req.body?.flatNumber || ''}`.trim();

    if (!name || !email || !societyId || !buildingId || !flatNumber) {
      return res.status(400).json({
        success: false,
        message:
          'Name, email, society, building and flat number are required',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    const dbService = DatabaseService.getInstance();
    const customerRepo = dbService.getCustomerRepository();
    const societyRepo = dbService.getSocietyRepository();
    const buildingRepo = dbService.getBuildingRepository();

    const society = await societyRepo.findById(societyId);
    if (!society) {
      return res.status(400).json({
        success: false,
        message: 'Selected society not found',
      });
    }

    const building = await buildingRepo.findById(buildingId);
    if (!building || building.societyId !== societyId) {
      return res.status(400).json({
        success: false,
        message: 'Selected building is invalid for this society',
      });
    }

    const existingByEmail = await customerRepo.findByEmail(email);
    if (existingByEmail) {
      return res.status(400).json({
        success: false,
        message: 'A customer with this email already exists',
      });
    }

    const existingByMobile = await findCustomerByMobile(
      customerRepo,
      payload.mobileNumber
    );
    if (existingByMobile) {
      return res.status(400).json({
        success: false,
        message: 'A customer with this mobile number already exists',
      });
    }

    const customer = await customerRepo.create({
      societyId,
      buildingId,
      name,
      email,
      mobileNumber: payload.mobileNumber,
      flatNumber,
      isMonthlyPayment: false,
    });

    await AppDataSource.query(
      `UPDATE customers SET "userId" = $1, "updatedAt" = now() WHERE id = $2`,
      [user.id, customer.id]
    );

    const updatedUser = await updateUserEmailAndLogin(user.id, email);

    const token = authTokenService.generateToken({
      sub: updatedUser.id,
      role: updatedUser.role,
      customerId: customer.id,
      mobileNumber: updatedUser.mobileNumber,
    });

    return res.status(201).json({
      success: true,
      message: 'Signup completed successfully',
      data: {
        token,
        requiresSignup: false,
        user: {
          id: updatedUser.id,
          role: updatedUser.role,
          mobileNumber: updatedUser.mobileNumber,
          email: updatedUser.email,
          name: customer.name,
          customerId: customer.id,
        },
        customer: mapCustomerForAuthResponse(customer),
      },
    });
  } catch (error) {
    console.error('Error completing signup:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to complete signup',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.get('/me', async (req, res) => {
  try {
    const authContext = await authenticateRequest(req.headers.authorization);

    if (!authContext) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    const { payload, user } = authContext;

    if (!payload.customerId) {
      return res.json({
        success: true,
        data: {
          requiresSignup: true,
          user: {
            id: user.id,
            role: user.role,
            mobileNumber: user.mobileNumber,
            email: user.email,
            name: '',
            customerId: null,
          },
          customer: null,
        },
      });
    }

    const dbService = DatabaseService.getInstance();
    const customerRepo = dbService.getCustomerRepository();

    const customer = await customerRepo.findById(payload.customerId);

    if (!customer) {
      return res.json({
        success: true,
        data: {
          requiresSignup: true,
          user: {
            id: user.id,
            role: user.role,
            mobileNumber: user.mobileNumber,
            email: user.email,
            name: '',
            customerId: null,
          },
          customer: null,
        },
      });
    }

    if (!customer.userId || customer.userId !== user.id) {
      await AppDataSource.query(
        `UPDATE customers SET "userId" = $1, "updatedAt" = now() WHERE id = $2`,
        [user.id, customer.id]
      );
    }

    return res.json({
      success: true,
      data: {
        requiresSignup: false,
        user: {
          id: user.id,
          role: user.role,
          mobileNumber: user.mobileNumber,
          email: user.email,
          name: customer.name,
          customerId: customer.id,
        },
        customer: mapCustomerForAuthResponse(customer),
      },
    });
  } catch (error) {
    console.error('Error loading auth profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to load profile',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.put('/profile', async (req, res) => {
  try {
    const authContext = await authenticateRequest(req.headers.authorization);

    if (!authContext) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    const { payload, user } = authContext;

    if (!payload.customerId) {
      return res.status(400).json({
        success: false,
        message: 'Signup is required before updating profile',
      });
    }

    const name = `${req.body?.name || ''}`.trim();
    const email = `${req.body?.email || ''}`.trim().toLowerCase();
    const societyId = `${req.body?.societyId || ''}`.trim();
    const buildingId = `${req.body?.buildingId || ''}`.trim();
    const flatNumber = `${req.body?.flatNumber || ''}`.trim();

    if (!name || !email || !societyId || !buildingId || !flatNumber) {
      return res.status(400).json({
        success: false,
        message:
          'Name, email, society, building and flat number are required',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    const dbService = DatabaseService.getInstance();
    const customerRepo = dbService.getCustomerRepository();
    const societyRepo = dbService.getSocietyRepository();
    const buildingRepo = dbService.getBuildingRepository();

    const existingCustomer = await customerRepo.findById(payload.customerId);
    if (!existingCustomer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found',
      });
    }

    const society = await societyRepo.findById(societyId);
    if (!society) {
      return res.status(400).json({
        success: false,
        message: 'Selected society not found',
      });
    }

    const building = await buildingRepo.findById(buildingId);
    if (!building || building.societyId !== societyId) {
      return res.status(400).json({
        success: false,
        message: 'Selected building is invalid for this society',
      });
    }

    const existingByEmail = await customerRepo.findByEmail(email);
    if (existingByEmail && existingByEmail.id !== existingCustomer.id) {
      return res.status(400).json({
        success: false,
        message: 'A customer with this email already exists',
      });
    }

    await customerRepo.update(existingCustomer.id, {
      name,
      email,
      societyId,
      buildingId,
      flatNumber,
    });

    const refreshedCustomer = await customerRepo.findById(existingCustomer.id);
    if (!refreshedCustomer) {
      return res.status(500).json({
        success: false,
        message: 'Failed to refresh updated profile',
      });
    }

    const updatedUser = await updateUserEmailAndLogin(user.id, email);

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: updatedUser.id,
          role: updatedUser.role,
          mobileNumber: updatedUser.mobileNumber,
          email: updatedUser.email,
          name: refreshedCustomer.name,
          customerId: refreshedCustomer.id,
        },
        customer: mapCustomerForAuthResponse(refreshedCustomer),
      },
    });
  } catch (error) {
    console.error('Error updating auth profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

function mapCustomerForAuthResponse(customer: any) {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    mobileNumber: customer.mobileNumber,
    societyId: customer.societyId,
    buildingId: customer.buildingId,
    flatNumber: customer.flatNumber,
    isMonthlyPayment: customer.isMonthlyPayment,
    society: customer.society
      ? {
          id: customer.society.id,
          name: customer.society.name,
        }
      : null,
    building: customer.building
      ? {
          id: customer.building.id,
          name: customer.building.name,
          societyId: customer.building.societyId,
        }
      : null,
  };
}

function getBearerToken(authorizationHeader?: string): string | null {
  if (!authorizationHeader) {
    return null;
  }

  const normalizedHeader = authorizationHeader.trim();
  const [scheme, token] = normalizedHeader.split(/\s+/);

  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null;
  }

  return token;
}

function normalizeMobileNumber(value?: string): string {
  if (!value) {
    return '';
  }

  const digits = value.replace(/\D/g, '');

  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }

  return digits;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function findCustomerByMobile(
  customerRepo: CustomerRepository,
  mobileNumber: string
) {
  const variants = [mobileNumber, `91${mobileNumber}`, `+91${mobileNumber}`];

  for (const mobileVariant of variants) {
    const customer = await customerRepo.findByMobileNumber(mobileVariant);
    if (customer) {
      return customer;
    }
  }

  return null;
}

async function upsertUserByMobile(input: {
  mobileNumber: string;
  email?: string | null;
  existingUserId?: string;
}): Promise<UserRecord> {
  let user: UserRecord | null = null;

  if (input.existingUserId) {
    user = await findUserById(input.existingUserId);
  }

  if (!user) {
    user = await findUserByMobile(input.mobileNumber);
  }

  if (!user) {
    const created = (await AppDataSource.query(
      `
        INSERT INTO users (
          "mobileNumber",
          email,
          role,
          "isActive",
          "lastLoginAt",
          "createdAt",
          "updatedAt"
        ) VALUES ($1, $2, 'customer', true, now(), now(), now())
        RETURNING id, "mobileNumber", email, role, "isActive"
      `,
      [input.mobileNumber, input.email || null]
    )) as UserRecord[];

    return created[0];
  }

  const updated = (await AppDataSource.query(
    `
      UPDATE users
      SET
        "mobileNumber" = $1,
        email = COALESCE($2, email),
        role = 'customer',
        "isActive" = true,
        "lastLoginAt" = now(),
        "updatedAt" = now()
      WHERE id = $3
      RETURNING id, "mobileNumber", email, role, "isActive"
    `,
    [input.mobileNumber, input.email || null, user.id]
  )) as UserRecord[];

  return updated[0];
}

async function findUserById(userId: string): Promise<UserRecord | null> {
  const users = (await AppDataSource.query(
    `SELECT id, "mobileNumber", email, role, "isActive" FROM users WHERE id = $1 LIMIT 1`,
    [userId]
  )) as UserRecord[];

  return users[0] || null;
}

async function findUserByMobile(mobileNumber: string): Promise<UserRecord | null> {
  const users = (await AppDataSource.query(
    `SELECT id, "mobileNumber", email, role, "isActive" FROM users WHERE "mobileNumber" = $1 LIMIT 1`,
    [mobileNumber]
  )) as UserRecord[];

  return users[0] || null;
}

async function updateUserEmailAndLogin(
  userId: string,
  email: string
): Promise<UserRecord> {
  const users = (await AppDataSource.query(
    `
      UPDATE users
      SET
        email = $1,
        role = 'customer',
        "isActive" = true,
        "lastLoginAt" = now(),
        "updatedAt" = now()
      WHERE id = $2
      RETURNING id, "mobileNumber", email, role, "isActive"
    `,
    [email, userId]
  )) as UserRecord[];

  return users[0];
}

async function authenticateRequest(
  authorizationHeader?: string
): Promise<AuthContext | null> {
  const token = getBearerToken(authorizationHeader);

  if (!token) {
    return null;
  }

  const payload = authTokenService.verifyToken(token);

  if (!payload) {
    return null;
  }

  let user = await findUserById(payload.sub);

  if (!user) {
    user = await findUserByMobile(payload.mobileNumber);
  }

  if (!user) {
    const dbService = DatabaseService.getInstance();
    const customerRepo = dbService.getCustomerRepository();
    const customer = payload.customerId
      ? await customerRepo.findById(payload.customerId)
      : await findCustomerByMobile(customerRepo, payload.mobileNumber);

    if (customer) {
      user = await upsertUserByMobile({
        mobileNumber: payload.mobileNumber,
        email: customer.email,
        existingUserId: customer.userId || undefined,
      });

      if (!customer.userId || customer.userId !== user.id) {
        await AppDataSource.query(
          `UPDATE customers SET "userId" = $1, "updatedAt" = now() WHERE id = $2`,
          [user.id, customer.id]
        );
      }
    }
  }

  if (!user) {
    return null;
  }

  return { user, payload };
}

function createOtpProvider(): OtpProvider {
  const provider = (process.env.OTP_PROVIDER || 'static').toLowerCase();

  if (provider === 'twilio') {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_FROM_NUMBER;

    if (accountSid && authToken && fromNumber) {
      return new TwilioOtpProvider({
        accountSid,
        authToken,
        fromNumber,
      });
    }

    console.warn(
      'TWILIO provider selected but credentials are missing. Falling back to STATIC OTP provider.'
    );
  }

  return new StaticOtpProvider();
}

export default router;
